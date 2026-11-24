export function heightToInches(height?: string): number | null {
  const cm = Number.parseFloat(height ?? "");

  if (!Number.isFinite(cm) || cm <= 0) return null;

  return Math.round(cm / 2.54);
}

export function weightToPounds(weight?: string): number | null {
  const kg = Number.parseFloat(weight ?? "");

  if (!Number.isFinite(kg) || kg <= 0) return null;

  return Math.round(kg * 2.20462262);
}