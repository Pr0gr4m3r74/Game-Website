export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '').substring(0, 1000);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatBits(amount: number): string {
  return `${amount.toLocaleString()} Bits`;
}
