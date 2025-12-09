export function FormatTime(ms) {
    if (ms < 1000) {
        return `${ms.toFixed(0)} мс`;
    } else if (ms < 60000) {
        return `${(ms / 1000).toFixed(2)} с`;
    }
    return `${(ms / 60000).toFixed(2)} мин`;
}

export function Clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}