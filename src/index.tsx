import { Card, defineCard } from '@maczejka/hass-react';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import styled from 'styled-components';

import { LayoutComponent } from './layout';
import { SolarLayoutConfig } from './types';

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

export const SolarLayoutCard: Card<SolarLayoutConfig> = {
    key: 'sunbichl-solar-layout',
    entities: (config) => uniq(flatten(config.layout)),
    Component: SolarLayoutCardComponent,
};

defineCard(SolarLayoutCard);
