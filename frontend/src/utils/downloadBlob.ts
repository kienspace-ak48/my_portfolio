/** Trigger a file download from a Blob (works better on mobile than cross-origin `<a download>`). */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function parseContentDispositionFilename(
  disposition: string | undefined,
): string | null {
  if (!disposition) return null;
  const match = disposition.match(/filename="([^"]+)"/);
  return match?.[1] ?? null;
}
