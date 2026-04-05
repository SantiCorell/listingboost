"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function CopyTextButton({
  text,
  label = "Copiar",
  className,
  variant = "outline",
  size = "sm",
}: {
  text: string;
  label?: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
}) {
  const [ok, setOk] = useState(false);

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          window.setTimeout(() => setOk(false), 2000);
        } catch {
          /* ignore */
        }
      }}
    >
      {ok ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  );
}
