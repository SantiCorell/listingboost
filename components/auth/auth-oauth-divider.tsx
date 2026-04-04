/** Separador estilo app móvil premium: línea + punto central. */
export function AuthOauthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1" role="separator" aria-label={label}>
      <div className="h-px flex-1 bg-border/90" />
      <span className="flex h-2 w-2 shrink-0 rounded-full bg-muted-foreground/20 ring-4 ring-background" aria-hidden />
      <div className="h-px flex-1 bg-border/90" />
    </div>
  );
}
