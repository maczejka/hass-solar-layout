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

const UnavailablePanelIcon = () => <PanelIcon color="gray" />;

type PanelProps = {
    entity: string;
    colors?: ColorStep[] | undefined;
};

export const PanelComponent = ({ entity, colors }: PanelProps) => {
    const { value, isAvailable, isValid } = useNumericEntity({ entityId: entity });

    if (!isAvailable || !isValid || value === undefined || !colors || colors.length === 0) {
        return <UnavailablePanelIcon />;
    }

    const values = colors.map((step) => step.value);
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
        { color: colors[0].color, pos: 0 },
        ...colors.map((color) => ({ color: color.color, pos: valuePos(color.value) })),
        { color: colors[colors.length - 1].color, pos: 1 },
    ]);

    const raw = range === 0 ? 0 : Math.floor((value / range) * 255);
    const index = Number.isFinite(raw) ? Math.max(0, Math.min(254, raw)) : 0;
    const resolvedColor = gradient.rgb(255)[index];

    if (!resolvedColor) {
        return <UnavailablePanelIcon />;
    }

    return (
        <PanelIcon color={resolvedColor.toHexString()}>
            <ValueWrapper>{Math.round(value)}</ValueWrapper>
        </PanelIcon>
    );
};
