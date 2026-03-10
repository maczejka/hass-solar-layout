import { defineCard } from '@maczejka/hass-react';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import styled from 'styled-components';

import { SolarLayoutEditor } from './editor';
import { LayoutComponent } from './layout';
import { SolarLayoutConfig, solarLayoutConfigSchema } from './types';

const CardWrapper = styled.div<{ $w?: number; $h?: number }>`
    width: ${({ $w }) => ($w ? `${$w}px` : '100%')};
    height: ${({ $h }) => ($h ? `${$h}px` : '100%')} !important;
`;

export const SolarLayoutCardComponent = ({ layout, size, colors }: SolarLayoutConfig) => {
    return (
        <CardWrapper $w={size?.width} $h={size?.height}>
            <LayoutComponent layout={layout} colors={colors} />
        </CardWrapper>
    );
};

defineCard({
    key: 'mac-solar-layout',
    name: 'Solar Layout',
    description: 'Color-coded grid showing solar panel output per entity.',
    schema: solarLayoutConfigSchema,
    entities: (config) => uniq(flatten(config.layout)).filter((id) => id !== '_'),
    Component: SolarLayoutCardComponent,
    Editor: SolarLayoutEditor,
    getStubConfig: () => ({
        layout: [['_', '_', '_']],
        colors: [
            { color: '#00bfff', value: 0 },
            { color: '#ffd700', value: 200 },
            { color: '#ff8c00', value: 600 },
        ],
    }),
});
