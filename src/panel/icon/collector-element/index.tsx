import styled from 'styled-components';
import tinycolor from 'tinycolor2';

type PanelProps = {
    color: string;
    mode: 'full' | 'half' | 'shaded';
};

const radius = '15%';

export const CollectorElement = styled.div<PanelProps>`
    clip-path: polygon(
        0 ${radius},
        ${radius} 0,
        calc(100% - ${radius}) 0,
        100% ${radius},
        100% calc(100% - ${radius}),
        calc(100% - ${radius}) 100%,
        ${radius} 100%,
        0 calc(100% - ${radius})
    );
    background: ${({ color, mode }) => {
        const dark = tinycolor(color).darken(10).toHexString();
        if (mode === 'shaded') {
            return dark;
        }
        if (mode === 'half') {
            return `linear-gradient(135deg, ${color} 0%,${color} 50%,${dark} 51%,${dark} 100%);`;
        }
        return color;
    }};
    width: 100%;
    height: 100%;
`;
