export function countryName(code, displayNames, unknownLabel) {
    const normalized = String(code ?? '').trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(normalized) || normalized === 'XX') return unknownLabel;
    try {
        return displayNames.of(normalized) || normalized;
    } catch {
        return normalized;
    }
}
