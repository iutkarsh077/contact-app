import en from "@/i18n/en";
import hi from "@/i18n/hi";
import te from "@/i18n/te";

const dictionaries = { en, hi, te };

export const LOCALES = [
  { id: "en", bcp47: "en-IN" },
  { id: "hi", bcp47: "hi-IN" },
  { id: "te", bcp47: "te-IN" },
];

export function isLocale(id) {
  return id === "en" || id === "hi" || id === "te";
}

export function localeToBcp47(locale) {
  const row = LOCALES.find((item) => item.id === locale);
  return row ? row.bcp47 : "en-IN";
}

function lookup(dict, key) {
  if (!dict || !key) return undefined;
  const i = key.indexOf(".");
  if (i === -1) {
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : undefined;
  }
  const head = key.slice(0, i);
  const rest = key.slice(i + 1);
  const next = dict[head];
  if (next == null || typeof next !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(next, rest)) return next[rest];
  return lookup(next, rest);
}

function interpolate(value, vars) {
  if (!vars) return String(value);
  return String(value).replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] == null ? `{${name}}` : String(vars[name]),
  );
}

export function translate(locale, key, vars) {
  const dict = isLocale(locale) ? dictionaries[locale] : en;
  let value = lookup(dict, key);
  if (value == null || typeof value === "object") value = lookup(en, key);
  if (value == null || typeof value === "object") return key;
  return interpolate(value, vars);
}
