// Lightweight synchronous hash for demo purposes (not cryptographically secure)
export function simpleHash(input: string): string {
  // djb2
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) + input.charCodeAt(i);
    h = h & h;
  }
  // return as hex
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function verifyHash(stored: string, candidate: string): boolean {
  if (!stored) return false;
  if (stored === candidate) return true; // legacy plaintext
  return stored === simpleHash(candidate);
}




