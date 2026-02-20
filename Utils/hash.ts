// utils/hash.ts
export function stableJoin(arr: string[]) {
  return arr
    .map((s) => s.trim())
    .filter(Boolean)
    .sort()
    .join("|");
}

// hash
export function fnv1a(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export function makePhonesHash(e164Phones: string[]) {
  return fnv1a(stableJoin(e164Phones));
}

export function makeContactHash(args: {
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

  return fnv1a(base);
}
