export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function copyHtml(html: string, plainText: string): Promise<boolean> {
  if (!html) return false;

  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plainText || html], { type: "text/plain" }),
        }),
      ]);
      return true;
    }
  } catch {
    // fall through to plain text
  }

  return copyText(plainText || html);
}
