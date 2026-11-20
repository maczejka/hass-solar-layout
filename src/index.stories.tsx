import { CardPlayground } from '@maczejka/hass-react/storybook';

import { SolarLayoutEditor } from './editor';
import { SolarLayoutConfig } from './types';

import { SolarLayoutCardComponent } from './index';

export default {
    title: 'Solar Layout / Card',
};

const val = 'sensor.panel';

export const Playground = () => (
    <CardPlayground
        card={{
            entities: (config: SolarLayoutConfig) =>
                [...new Set(config.layout.flat())].filter((id) => id !== '_'),
            Component: SolarLayoutCardComponent,
            Editor: SolarLayoutEditor,
        }}
        initialConfig={{
            layout: [
                [val, val, val, val, val],
                [val, val, val, val, val],
                [val, val, val, val, val],
                [val, val, val, val, val, val, val, val, val],
                ['_'],
                [val, val, val, val, val],
            ],
            colors: [
                { color: '#00bfff', value: 0 },
                { color: '#ffd700', value: 200 },
                { color: '#ff8c00', value: 600 },
            ],
            title: 'PV modules',
            group_names: ['Roof', 'Balcony'],
        }}
        initialEntities={{
            'sensor.panel': '460',
        }}
    />
);
