import styled from 'styled-components';

import { buildScale } from '../scale';

import { ModuleComponent } from './index';

export default {
    title: 'Solar Layout / Module',
};

const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 72px);
    gap: 6px;
    padding: 16px;
    background: #111;
`;

const scale = buildScale([
    { color: 'blue', value: 0 },
    { color: 'deepskyblue', value: 20 },
    { color: 'yellow', value: 40 },
    { color: 'orange', value: 250 },
    { color: 'red', value: 440 },
]);

const values: (number | undefined)[] = [0, 15, 60, 180, 270, 420];

export const Output = () => (
    <Row>
        {values.map((v, i) => (
            <ModuleComponent
                key={i}
                entity={`sensor.panel_${i}`}
                value={v}
                color={v === undefined ? '#808080' : scale.color(v)}
                intensity={v === undefined ? 0 : scale.position(v)}
                label={v === undefined ? '' : `${v}`}
                title={`${v} W`}
            />
        ))}
    </Row>
);

export const PortraitWeakAndOffline = () => (
    <Row>
        <ModuleComponent
            entity="a"
            value={260}
            color={scale.color(260)}
            intensity={scale.position(260)}
            label="260"
            title=""
            aspect={0.6}
        />
        <ModuleComponent
            entity="b"
            value={90}
            color={scale.color(90)}
            intensity={scale.position(90)}
            label="90"
            title=""
            aspect={0.6}
            weak
        />
        <ModuleComponent
            entity="c"
            value={undefined}
            color="#808080"
            intensity={0}
            label=""
            title=""
            aspect={0.6}
        />
    </Row>
);
