import { useMockedEntityValue } from '@maczejka/hass-react';
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
