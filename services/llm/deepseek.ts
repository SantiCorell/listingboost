import { prisma } from "@/lib/prisma";

export type ChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "user";
      content: (
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      )[];
    };

type DeepSeekResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
};

const DEFAULT_BASE = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-chat";

function stripJsonFence(s: string): string {
  const t = s.trim();
  if (t.startsWith("```")) {
    return t.replace(/^```[a-zA-Z]*\n?/, "").replace(/```\s*$/, "");
  }
  return t;
}

/** Límite superior seguro para deepseek-chat (evita 400 por max_tokens inválido). */
const MAX_OUTPUT_TOKENS_CAP = 8192;

function clampMaxTokens(requested: number | undefined): number {
  const n = requested ?? 4096;
  return Math.min(Math.max(n, 256), MAX_OUTPUT_TOKENS_CAP);
}

function appendJsonOnlyHint(messages: ChatMessage[]): ChatMessage[] {
  const hint =
    "\n\nResponde únicamente con un único objeto JSON válido (sin bloques markdown ni texto antes o después).";
  const out = [...messages];
  const last = out[out.length - 1];
  if (last?.role === "user" && typeof last.content === "string") {
    out[out.length - 1] = { role: "user", content: last.content + hint };
  }
  return out;
}

export async function deepseekChatJson(params: {
  messages: ChatMessage[];
  userId?: string;
  operation: string;
  timeoutMs?: number;
  model?: string;
  /** Límite de tokens de salida (p. ej. informes largos en JSON). */
  maxTokens?: number;
}): Promise<{ ok: true; json: unknown } | { ok: false; error: string }> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error:
        "El motor de análisis no está configurado. Revisa las variables de entorno del servidor.",
    };
  }

  const base = process.env.DEEPSEEK_API_BASE ?? DEFAULT_BASE;
  const model = params.model ?? process.env.DEEPSEEK_MODEL ?? DEFAULT_MODEL;
  const timeoutMs = params.timeoutMs ?? 120_000;
  const started = Date.now();
  const safeMax = clampMaxTokens(params.maxTokens);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  async function callApi(jsonMode: boolean, messages: ChatMessage[]): Promise<Response> {
    const body: Record<string, unknown> = {
      model,
      messages,
      stream: false,
      max_tokens: safeMax,
    };
    if (jsonMode) body.response_format = { type: "json_object" };
    return fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
  }

  try {
    let res = await callApi(true, params.messages);
    let text = await res.text();

    if (!res.ok && (res.status === 400 || res.status === 422)) {
      await logApi(params.userId, `${params.operation}:retry_plain`, false, Date.now() - started, {
        message: `json_mode rejected (${res.status}): ${text.slice(0, 400)}`,
      });
      res = await callApi(false, appendJsonOnlyHint(params.messages));
      text = await res.text();
    }

    let data: DeepSeekResponse;
    try {
      data = JSON.parse(text) as DeepSeekResponse;
    } catch {
      await logApi(params.userId, params.operation, false, Date.now() - started, {
        message: `Respuesta no JSON (${res.status}): ${text.slice(0, 500)}`,
      });
      return { ok: false, error: "Respuesta inválida del motor de análisis." };
    }

    if (!res.ok) {
      const internal =
        data.error?.message ?? `HTTP ${res.status}: ${text.slice(0, 400)}`;
      await logApi(params.userId, params.operation, false, Date.now() - started, {
        message: internal,
      });
      return {
        ok: false,
        error:
          "El servicio de análisis no está disponible en este momento. Inténtalo de nuevo en unos minutos.",
      };
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      await logApi(params.userId, params.operation, false, Date.now() - started, {
        message: "Sin contenido en choices",
      });
      return {
        ok: false,
        error: "No se recibió contenido del motor de análisis. Vuelve a intentarlo.",
      };
    }

    const cleaned = stripJsonFence(content);
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      await logApi(params.userId, params.operation, false, Date.now() - started, {
        message: `JSON parse error: ${e}`,
      });
      return {
        ok: false,
        error: "La respuesta no pudo procesarse. Prueba de nuevo o simplifica el texto de entrada.",
      };
    }

    await logApi(params.userId, params.operation, true, Date.now() - started, null);
    return { ok: true, json: parsed };
  } catch (e) {
    const internal =
      e instanceof Error
        ? e.name === "AbortError"
          ? "Timeout motor análisis"
          : e.message
        : "Error desconocido";
    await logApi(params.userId, params.operation, false, Date.now() - started, {
      message: internal,
    });
    return {
      ok: false,
      error:
        e instanceof Error && e.name === "AbortError"
          ? "Tiempo de espera agotado. Inténtalo de nuevo."
          : "Error al conectar con el motor de análisis.",
    };
  } finally {
    clearTimeout(timer);
  }
}

async function logApi(
  userId: string | undefined,
  operation: string,
  ok: boolean,
  latencyMs: number,
  extra: { message: string } | null,
) {
  try {
    await prisma.apiLog.create({
      data: {
        userId: userId ?? null,
        provider: "deepseek",
        operation,
        ok,
        latencyMs,
        message: extra?.message ?? null,
      },
    });
  } catch {
    /* logging no debe tumbar flujo */
  }
}

export async function deepseekChatJsonWithVisionFallback(params: {
  system: string;
  userText: string;
  imageUrl?: string | null;
  userId?: string;
  operation: string;
}): Promise<{ ok: true; json: unknown } | { ok: false; error: string }> {
  const visionEnabled = process.env.DEEPSEEK_VISION_MODEL;
  if (params.imageUrl && visionEnabled) {
    const multimodal: ChatMessage[] = [
      { role: "system", content: params.system },
      {
        role: "user",
        content: [
          { type: "text", text: params.userText },
          { type: "image_url", image_url: { url: params.imageUrl } },
        ],
      },
    ];
    const v = await deepseekChatJson({
      messages: multimodal,
      userId: params.userId,
      operation: `${params.operation}:vision`,
      model: visionEnabled,
    });
    if (v.ok) return v;
  }

  const textFallback = params.imageUrl
    ? `${params.userText}\n\nNOTA: Hay imagen de producto en ${params.imageUrl} pero el análisis multimodal no está disponible o falló. Prioriza el texto y pide en altText una descripción coherente con típicos usos del producto sin inventar detalles no dichos.`
    : params.userText;

  return deepseekChatJson({
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: textFallback },
    ],
    userId: params.userId,
    operation: params.operation,
  });
}
