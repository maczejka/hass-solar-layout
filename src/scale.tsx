import tinycolor from 'tinycolor2';
import tinygradient from 'tinygradient';

import { ColorStep } from './types';

export type Scale = {
    min: number;
    max: number;
    /** Gradient colour for a value (clamped to the stops). */
    color: (value: number) => string;
    /** 0–1 position of a value between the lowest and highest stop. */
    position: (value: number) => number;
    /** CSS linear-gradient of the stops (for the legend). */
    css: string;
    stops: { color: string; value: number; pos: number }[];
};

const FALLBACK: ColorStep[] = [
    { color: '#00bfff', value: 0 },
    { color: '#ffd700', value: 200 },
    { color: '#ff8c00', value: 600 },
];

export function buildScale(colors: ColorStep[] | undefined): Scale {
    const steps = (colors && colors.length > 0 ? colors : FALLBACK)
        .map((c, i, all) => ({
            color: c.color,
            value: c.value ?? (i === 0 ? 0 : (all[i - 1].value ?? 0)),
        }))
        .filter((c) => tinycolor(c.color).isValid())
        .sort((a, b) => a.value - b.value);
    const safe =
        steps.length > 0 ? steps : FALLBACK.map((c) => ({ color: c.color, value: c.value ?? 0 }));
    const min = safe[0].value;
    const max = safe[safe.length - 1].value;
    const range = max - min;
    const position = (value: number) =>
        range <= 0 ? 0 : Math.max(0, Math.min(1, (value - min) / range));
    const stops = safe.map((c) => ({ ...c, pos: position(c.value) }));

    // tinygradient needs strictly increasing positions within 0..1
    const unique = stops.filter((s, i) => i === 0 || s.pos > stops[i - 1].pos);
    const gradient =
        unique.length >= 2
            ? tinygradient(unique.map((s) => ({ color: s.color, pos: s.pos })))
            : undefined;
    const SAMPLES = 256;
    const samples = gradient ? gradient.rgb(SAMPLES) : [];

    return {
        min,
        max,
        position,
        stops,
        color: (value: number) => {
            if (!gradient || samples.length === 0) {
                return tinycolor(unique[0]?.color ?? '#808080').toHexString();
            }
            const i = Math.round(position(value) * (SAMPLES - 1));
            return (samples[i] ?? samples[samples.length - 1]).toHexString();
        },
        css: `linear-gradient(90deg, ${unique.map((s) => `${tinycolor(s.color).toHexString()} ${(s.pos * 100).toFixed(1)}%`).join(', ')})`,
    };
}
