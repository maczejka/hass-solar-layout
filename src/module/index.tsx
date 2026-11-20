import { useRef } from 'react';

import styled, { css, keyframes } from 'styled-components';
import tinycolor from 'tinycolor2';

// A photovoltaic module: aluminium frame, cell grid, glass sheen. Its glass is dark module-blue at no output and
// takes on the gradient colour (and a glow) the more it produces. Weak panels get an amber marker.

const BASE = '#10213a';

const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
`;

const Frame = styled.button<{
    $aspect: number;
    $glass: string;
    $glow: string;
    $intensity: number;
    $off: boolean;
    $weak: boolean;
    $cols: number;
    $rows: number;
}>`
    all: unset;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    aspect-ratio: ${({ $aspect }) => $aspect};
    border-radius: 3px;
    cursor: pointer;
    container-type: inline-size;
    /* aluminium frame */
    border: 1.5px solid rgba(200, 210, 225, 0.55);
    box-shadow:
        inset 0 0 0 1px rgba(0, 0, 0, 0.35),
        0 0 ${({ $intensity }) => (2 + $intensity * 12).toFixed(1)}px ${({ $glow }) => $glow};
    background-color: ${({ $glass }) => $glass};
    /* cell grid + busbars + glass sheen */
    background-image:
        linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.04) 38%,
            rgba(255, 255, 255, 0) 55%,
            rgba(255, 255, 255, 0.07) 100%
        ),
        repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.32) 0 1px,
            transparent 1px calc(100% / ${({ $cols }) => $cols})
        ),
        repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.32) 0 1px,
            transparent 1px calc(100% / ${({ $rows }) => $rows})
        ),
        repeating-linear-gradient(
            90deg,
            transparent 0 calc(100% / ${({ $cols }) => $cols * 3} - 0.5px),
            rgba(255, 255, 255, 0.07) calc(100% / ${({ $cols }) => $cols * 3} - 0.5px)
                calc(100% / ${({ $cols }) => $cols * 3})
        );
    transition:
        background-color 1.2s ease,
        box-shadow 1.2s ease,
        transform 0.15s ease;
    -webkit-tap-highlight-color: transparent;
    &:hover {
        transform: translateY(-1px) scale(1.03);
        z-index: 1;
    }
    &:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 1px;
    }
    ${({ $off }) =>
        $off &&
        css`
            border-color: rgba(160, 160, 160, 0.35);
            box-shadow: none;
            background-color: #2a2d33;
            background-image: repeating-linear-gradient(
                -45deg,
                rgba(255, 255, 255, 0.06) 0 4px,
                transparent 4px 9px
            );
        `}
    ${({ $weak }) =>
        $weak &&
        css`
            border-color: rgba(255, 179, 0, 0.9);
        `}
`;

const Value = styled.span<{ $light: boolean }>`
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
    font-weight: 600;
    font-size: clamp(8px, 24cqw, 15px);
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    color: ${({ $light }) => ($light ? 'rgba(255, 255, 255, 0.96)' : 'rgba(20, 20, 20, 0.88)')};
    text-shadow: ${({ $light }) =>
        $light ? '0 1px 2px rgba(0, 0, 0, 0.6)' : '0 1px 1px rgba(255, 255, 255, 0.35)'};
    pointer-events: none;
`;

const Marker = styled.span`
    position: absolute;
    top: 6%;
    right: 6%;
    width: clamp(4px, 14cqw, 8px);
    height: clamp(4px, 14cqw, 8px);
    border-radius: 50%;
    background: #ffb300;
    box-shadow: 0 0 4px #ffb300;
    animation: ${pulse} 2.4s ease-in-out infinite;
    pointer-events: none;
`;

export type ModuleProps = {
    entity: string;
    value: number | undefined;
    /** Gradient colour for the value. */
    color: string;
    /** 0–1 position on the colour scale (drives glass tint and glow). */
    intensity: number;
    label: string;
    title: string;
    weak?: boolean;
    showValue?: boolean;
    aspect?: number;
};

export const ModuleComponent = ({
    entity,
    value,
    color,
    intensity,
    label,
    title,
    weak = false,
    showValue = true,
    aspect = 1,
}: ModuleProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const off = value === undefined;
    // glass in the gradient colour, darker (and a touch of module-blue) at low output, full colour at peak
    const glass = off
        ? '#2a2d33'
        : tinycolor
              .mix(BASE, tinycolor(color).darken((1 - intensity) * 14), 82 + intensity * 18)
              .toHexString();
    const glow = off
        ? 'transparent'
        : tinycolor(color)
              .setAlpha(0.15 + intensity * 0.5)
              .toRgbString();
    const light = off || tinycolor(glass).getLuminance() < 0.42;
    // cell grid: 6 columns, rows follow the aspect ratio (a 60-cell module is 6 × 10)
    const cols = 6;
    const rows = Math.max(2, Math.round(cols / aspect));

    return (
        <Frame
            ref={ref}
            type="button"
            title={title}
            aria-label={title}
            $aspect={aspect}
            $glass={glass}
            $glow={glow}
            $intensity={intensity}
            $off={off}
            $weak={weak}
            $cols={cols}
            $rows={rows}
            onClick={() =>
                ref.current?.dispatchEvent(
                    new CustomEvent('hass-more-info', {
                        detail: { entityId: entity },
                        bubbles: true,
                        composed: true,
                    }),
                )
            }
        >
            {showValue && <Value $light={light}>{off ? '–' : label}</Value>}
            {weak && !off && <Marker />}
        </Frame>
    );
};
