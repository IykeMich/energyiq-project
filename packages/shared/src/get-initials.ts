// Returns the two-character initials of a name (e.g. "Andrew Franklin" -> "AF",
// "Andrew" -> "AN", "" -> ""). Ported from energyiq's StringUtil.abbreviateToTwoCharacter.
export function getInitials(name: string | null | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const first = parts[0] ?? '';
  if (first.length > 1) return (first[0] + first[1]).toUpperCase();
  return first[0]?.toUpperCase() ?? '';
}
