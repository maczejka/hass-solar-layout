import { CardPlayground } from '@maczejka/hass-react/storybook';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

import { SolarLayoutEditor } from './editor';
import { SolarLayoutCardComponent } from './index';
import { SolarLayoutConfig } from './types';

export default {
    title: 'Solar Layout / Card',
};

const val = 'sensor.panel';

export const Playground = () => (
    <CardPlayground
        card={{
            entities: (config: SolarLayoutConfig) =>
                uniq(flatten(config.layout)).filter((id) => id !== '_'),
            Component: SolarLayoutCardComponent,
            Editor: SolarLayoutEditor,
        }}
        initialConfig={{
            layout: [
                [val, val, val, val, val],
                [val, val, val, val, val],
                [val, val, val, val, val],
                [val, val, val, val, val, val, val, val, val],
                [],
                [val, val, val, val, val],
            ],
            colors: [
                { color: '#00bfff', value: 0 },
                { color: '#ffd700', value: 200 },
                { color: '#ff8c00', value: 600 },
            ],
            size: { width: 320, height: 200 },
        }}
        initialEntities={{
            'sensor.panel': '460',
        }}
    />
);
