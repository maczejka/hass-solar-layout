import { createEntityHook } from '@maczejka/hass-react';
import max from 'lodash/max';
import min from 'lodash/min';
import styled from 'styled-components';
import tinygradient from 'tinygradient';
import * as v from 'valibot';

import { ColorStep } from '../types';

import { PanelIcon } from './icon';

const useNumericEntity = createEntityHook(
    v.pipe(v.string(), v.transform(Number), v.number(), v.finite()),
);

const ValueWrapper = styled.div`
    font-size: small;
`;

type PanelProps = {
    entity: string;
    colors?: ColorStep[] | undefined;
};

export const PanelComponent = ({ entity, colors }: PanelProps) => {
    const { value, isAvailable, isValid } = useNumericEntity({ entityId: entity });

    if (!isAvailable || !isValid || value === undefined) {
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

    const raw = range === 0 ? 0 : Math.floor((value / range) * 255);
    const index = Number.isFinite(raw) ? Math.max(0, Math.min(254, raw)) : 0;
    const color = gradient.rgb(255)[index];

    return (
        <PanelIcon color={color.toHexString()}>
            <ValueWrapper>{Math.round(value)}</ValueWrapper>
        </PanelIcon>
    );
};
