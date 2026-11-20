// Minimal German / English labels; Home Assistant sets <html lang> to the user's language.
const de = {
    total: 'Gesamt',
    avg: 'Ø',
    best: 'max',
    worst: 'min',
    active: 'aktiv',
    weak: 'schwach',
    of: 'von',
    offline: 'offline',
    median: 'Median',
};
const en: typeof de = {
    total: 'Total',
    avg: 'avg',
    best: 'max',
    worst: 'min',
    active: 'active',
    weak: 'weak',
    of: 'of',
    offline: 'offline',
    median: 'median',
};

export const lang = () =>
    (typeof document !== 'undefined' && document.documentElement.lang) ||
    (typeof navigator !== 'undefined' ? navigator.language : 'en');
export const t = () => (lang().toLowerCase().startsWith('de') ? de : en);

export const formatPower = (w: number, unit: string) => {
    const nf = (d: number) =>
        new Intl.NumberFormat(lang(), { maximumFractionDigits: d, minimumFractionDigits: d });
    if (unit === 'W' && Math.abs(w) >= 1000) {
        return `${nf(1).format(w / 1000)} kW`;
    }
    return `${nf(0).format(w)} ${unit}`.trim();
};
