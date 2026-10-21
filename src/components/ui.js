export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";

export const labelClass = "mb-1 block text-xs font-medium text-slate-600";

export const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";

export function formatDate(iso, locale) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const tag =
    locale === "hi" ? "hi-IN" : locale === "te" ? "te-IN" : "en-IN";
  return d.toLocaleString(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: iso.includes("T") && iso.length > 10 ? "2-digit" : undefined,
    minute: iso.includes("T") && iso.length > 10 ? "2-digit" : undefined,
  });
}

export function formatPhone(phone) {
  if (!phone) return "—";
  const d = String(phone).replace(/\D/g, "");
  if (d.length === 10) return `${d.slice(0, 5)} ${d.slice(5)}`;
  return phone;
}

export async function fileToDocument(file) {
  if (!file) return { documentName: "", documentDataUrl: "" };
  if (file.size > 400 * 1024) {
    throw new Error("POC limit: attach a file smaller than 400 KB");
  }
  const documentDataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
  return { documentName: file.name, documentDataUrl };
}
