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

export async function deepseekChatJson(params: {
  messages: ChatMessage[];
  userId?: string;
  operation: string;
  timeoutMs?: number;
  model?: string;
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: params.messages,
        stream: false,
        response_format: { type: "json_object" },
      }),
    });

    const text = await res.text();
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
