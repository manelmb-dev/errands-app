// Utils/hash.ts
import * as Crypto from "expo-crypto";

export function stableJoin(values: string[]) {
  const cleaned = values.map((v) => v.trim()).filter(Boolean);
  cleaned.sort();
  return cleaned.join("|");
}

export async function sha256(text: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

export async function makePhonesHash(e164Phones: string[]) {
  const base = stableJoin(e164Phones);
  return sha256(base);
}

export async function makeContactHash(args: {
  displayName: string;
  firstName?: string;
  lastName?: string;
  e164Phones: string[];
}) {
  const base = [
    args.displayName ?? "",
    args.firstName ?? "",
    args.lastName ?? "",
    stableJoin(args.e164Phones),
  ].join("::");

  return sha256(base);
}
