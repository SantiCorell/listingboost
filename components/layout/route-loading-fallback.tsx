/**
 * Fallback de rutas (App Router `loading.tsx`): feedback accesible mientras navega el servidor.
 */
export function RouteLoadingFallback({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-[42vh] flex-col items-center justify-center gap-4 px-4 py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        className="h-10 w-10 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  );
}
