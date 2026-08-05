const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-[#388E3C]"];

export function usePasswordStrength(password: string | undefined) {
  let score = 0;
  if (password) {
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
  }

  return {
    score,
    label: score > 0 ? strengthLabels[score - 1] : undefined,
    barColor: score > 0 ? strengthColors[score - 1] : undefined,
    textColor: score > 0 ? strengthColors[score - 1].replace("bg-", "text-") : undefined,
  };
}
