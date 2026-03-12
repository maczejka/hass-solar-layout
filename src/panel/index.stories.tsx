import { useMockedEntityValue } from '@maczejka/hass-react';
import styled from 'styled-components';

import { PanelComponent } from './index';

export default {
    Component: PanelComponent,
};

const ExamplePanel = () => {
    useMockedEntityValue('sensor.ns22b9354955_temperature', '16.2334');

    return <PanelComponent entity="sensor.ns22b9354955_temperature" />;
};

export const PanelComponentExampleSmall = () => {
    const Container = styled.div`
        width: 32px;
        height: 32px;
    `;

    return (
        <Container>
            <ExamplePanel />
        </Container>
    );
};

export const PanelComponentExampleLarge = () => {
    const Container = styled.div`
        width: 128px;
        height: 128px;
    `;

    return (
        <Container>
            <ExamplePanel />
        </Container>
    );
};
