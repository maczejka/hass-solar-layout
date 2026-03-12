import { useMockedEntityValue } from '@maczejka/hass-react';
import styled from 'styled-components';

import { LayoutComponent } from './index';

export default {
    Component: LayoutComponent,
};

const ExampleLayout = () => {
    useMockedEntityValue('sensor.ns22b9354955_temperature', '16.2334');

    const val = 'sensor.ns22b9354955_temperature';

    const layout = [[val, val, val], [val], ['_', '_', val]];

    return <LayoutComponent layout={layout} />;
};

const SmallContainer = styled.div`
    width: 200px;
    height: 64px;
`;

const LargeContainer = styled.div`
    width: 512px;
    height: 512px;
`;

export const LayoutComponentExampleSmall = () => (
    <SmallContainer>
        <ExampleLayout />
    </SmallContainer>
);

export const LayoutComponentExampleLarge = () => (
    <LargeContainer>
        <ExampleLayout />
    </LargeContainer>
);

const MixedAvailabilityLayout = () => {
    useMockedEntityValue('sensor.panel_1', '320');
    useMockedEntityValue('sensor.panel_2', '460');
    useMockedEntityValue('sensor.panel_3', 'unavailable');
    useMockedEntityValue('sensor.panel_4', '180');
    useMockedEntityValue('sensor.panel_5', 'unknown');
    useMockedEntityValue('sensor.panel_6', '540');
    useMockedEntityValue('sensor.panel_missing', null);

    const layout = [
        ['sensor.panel_1', 'sensor.panel_2', 'sensor.panel_3'],
        ['sensor.panel_4', 'sensor.panel_5', 'sensor.panel_6'],
        ['sensor.panel_missing', '_', 'sensor.panel_1'],
    ];

    return (
        <LayoutComponent
            layout={layout}
            colors={[
                { color: '#00bfff', value: 0 },
                { color: '#ffd700', value: 200 },
                { color: '#ff8c00', value: 600 },
            ]}
        />
    );
};

export const MixedAvailability = () => (
    <LargeContainer>
        <MixedAvailabilityLayout />
    </LargeContainer>
);
