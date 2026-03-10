import { useMockedEntityValue } from '@maczejka/hass-react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

import { LayoutComponent } from './index';

export default {
    Component: LayoutComponent,
};

const ExampleLayout = () => {
    useMockedEntityValue('sensor.ns22b9354955_temperature', 16.2334);

    const val = 'sensor.ns22b9354955_temperature';

    const layout = [[val, val, val], [val], ['_', '_', val]];

    return <LayoutComponent layout={layout} />;
};

const SunbichlLayout = () => {
    useMockedEntityValue('sensor.ns22b9354955_temperature', 460.2334);

    const val = 'sensor.ns22b9354955_temperature';

    const layout = [
        [val, val, val, val, val],
        [val, val, val, val, val],
        [val, val, val, val, val],
        [val, val, val, val, val, val, val, val, val],
        [],
        [val, val, val, val, val],
    ];

    return (
        <LayoutComponent
            layout={layout}
            colors={[
                { color: 'deepskyblue', value: 0 },
                { color: 'yellow', value: 200 },
                { color: 'orange', value: 600 },
            ]}
        />
    );
};

export const LayoutComponentExampleSmall = () => {
    const Container = styled.div`
        width: 200px;
        height: 64px;
    `;

    return (
        <Container>
            <ExampleLayout />
        </Container>
    );
};

export const PanelComponentExampleLarge = () => {
    const Container = styled.div`
        width: 512px;
        height: 512px;
    `;

    return (
        <Container>
            <ExampleLayout />
        </Container>
    );
};

export const ResizableExampleSunbichl = () => {
    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'solid 1px #ddd',
        background: '#f0f0f0',
    };

    return (
        <Rnd
            style={style}
            default={{
                x: 0,
                y: 0,
                width: 320,
                height: 200,
            }}
        >
            <SunbichlLayout />
        </Rnd>
    );
};
