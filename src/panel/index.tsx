import { useEntity } from '@maczejka/hass-react';
import max from 'lodash/max';
import min from 'lodash/min';
import styled from 'styled-components';
import tinygradient from 'tinygradient';

import { ColorStep } from '../types';

import { PanelIcon } from './icon';

const ValueWrapper = styled.div`
    font-size: small;
`;

type PanelProps = {
    entity: string;
    colors?: ColorStep[] | undefined;
};

export const PanelComponent = ({ entity, colors }: PanelProps) => {
    const value = useEntity({ entityId: entity });

    if (value === undefined) {
        return <PanelIcon color="gray" />;
    }

    const values = (colors || []).map((step) => step.value);
    const minValue = min(values) || 0;
    const maxValue = max(values) || 0;
    const range = maxValue - minValue;

    const valuePos = (val: number | undefined) => {
        if (range === 0 || val === undefined) {
            return 0;
        }
        return val / range;
    };

    const gradient = tinygradient([
        {
            color: colors !== undefined && colors?.length > 0 ? colors[0].color : 'deepskyblue',
            pos: 0,
        },
        ...(colors || []).map((color) => ({ color: color.color, pos: valuePos(color.value) })),
        {
            color:
                colors !== undefined && colors?.length > 0
                    ? colors[colors.length - 1].color
                    : 'deepskyblue',
            pos: 1,
        },
    ]);

    const color = gradient.rgb(255)[range === 0 ? 0 : Math.floor((value / range) * 255)];

    return (
        <PanelIcon color={color.toHexString()}>
            <ValueWrapper>{Math.round(value)}</ValueWrapper>
        </PanelIcon>
    );
};
