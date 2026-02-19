import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";

export function normalizeToE164(
  raw: string,
  defaultRegion: string,
): string | null {
  const s = (raw ?? "").trim();
  if (!s) return null;

  // parse using default region if number is national
  const phone = parsePhoneNumberFromString(s, defaultRegion as any);
  if (!phone) return null;
  if (!phone.isValid()) return null;

  return phone.number; // E.164 e.g. +34600123456
}

export function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}
