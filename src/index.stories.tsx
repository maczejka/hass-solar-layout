import { useMockedEntityValue } from '@maczejka/hass-react';

import { SolarLayoutCardComponent } from './index';

export default {
    Component: SolarLayoutCardComponent,
};

export const SolarLayoutCardComponentExample = () => {
    useMockedEntityValue('sensor.ns22b9354955_temperature', 16.2334);

    const layout = [
        [
            'sensor.235235t4_temperature',
            'sensor.ns22b9354955_temperature',
            'sensor.235235t4_temperature',
        ],
        ['sensor.235235t4_temperature'],
        ['_', '_', 'sensor.235235t4_temperature'],
    ];

    return (
        <SolarLayoutCardComponent
            layout={layout}
            colors={[
                { color: 'deepskyblue', value: 0 },
                { color: 'yellow', value: 200 },
                { color: 'orange', value: 600 },
            ]}
            size={{ width: 200, height: 200 }}
        />
    );
};
