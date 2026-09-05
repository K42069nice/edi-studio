export function formatXml(xml: string): string {
  const trimmed = xml.trim();

  if (!trimmed) return xml;

  try {
    const parser = new DOMParser();
    const document = parser.parseFromString(trimmed, "application/xml");

    if (document.querySelector("parsererror")) {
      return xml;
    }

    const PADDING = "  ";
    const reg = /(>)(<)(\/*)/g;

    let formatted = "";
    let pad = 0;

    const normalized = trimmed
      .replace(/\r?\n/g, "")
      .replace(/>\s+</g, "><")
      .replace(reg, "$1\n$2$3");

    normalized.split("\n").forEach((node) => {
      let indent = 0;

      if (/^<\//.test(node)) {
        pad = Math.max(pad - 1, 0);
      } else if (
        /^<[^!?/][^>]*[^/]?>.*<\/[^>]+>$/.test(node)
      ) {
        indent = 0;
      } else if (
        /^<[^!?/][^>]*[^/]?>$/.test(node)
      ) {
        indent = 1;
      }

      formatted += PADDING.repeat(pad) + node.trim() + "\n";

      pad += indent;
    });

    return formatted.trim();
  } catch {
    return xml;
  }
}