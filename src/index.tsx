import { defineCard } from '@maczejka/hass-react';
import styled from 'styled-components';

import { SolarLayoutEditor } from './editor';
import { LayoutComponent } from './layout';
import { SolarLayoutConfig, solarLayoutConfigSchema } from './types';

const Card = styled.div<{ $w?: number }>`
    box-sizing: border-box;
    width: ${({ $w }) => ($w ? `${$w}px` : '100%')};
    max-width: 100%;
    padding: 12px;
    background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
    border: var(--ha-card-border-width, 1px) solid
        var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, none);
    color: var(--primary-text-color);
`;

export const SolarLayoutCardComponent = ({
    layout,
    size,
    colors,
    title,
    show_summary,
    show_legend,
    show_values,
    aspect_ratio,
    outlier_threshold,
    group_names,
}: SolarLayoutConfig) => (
    <Card $w={size?.width}>
        <LayoutComponent
            layout={layout}
            colors={colors}
            title={title}
            showSummary={show_summary ?? true}
            showLegend={show_legend ?? true}
            showValues={show_values ?? true}
            aspect={aspect_ratio && aspect_ratio > 0 ? aspect_ratio : 1}
            outlierThreshold={outlier_threshold ?? 0.7}
            groupNames={group_names}
            maxGridHeight={size?.height}
        />
    </Card>
);

defineCard({
    key: 'mac-solar-layout',
    name: 'Solar Layout',
    description:
        'Solar panels as modules that glow with their output, with totals, weak-panel detection and a legend.',
    schema: solarLayoutConfigSchema,
    entities: (config) => [...new Set(config.layout.flat())].filter((id) => id && id !== '_'),
    Component: SolarLayoutCardComponent,
    Editor: SolarLayoutEditor,
    getStubConfig: () => ({
        layout: [['_', '_', '_']],
        colors: [
            { color: '#00bfff', value: 0 },
            { color: '#ffd700', value: 200 },
            { color: '#ff8c00', value: 600 },
        ],
    }),
});
