import { useMemo } from 'react';

import { useEntityState } from '@maczejka/hass-react';
import styled from 'styled-components';

import { formatPower, t } from '../i18n';
import { ModuleComponent } from '../module';
import { buildScale } from '../scale';
import { ColorStep, Layout } from '../types';

const GAP = 4;
const SPACER = 0.35; // height of an empty row relative to a panel

const Grid = styled.div<{ $cols: number }>`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
    gap: ${GAP}px;
    margin: 0 auto;
    align-content: start;
`;

/** Empty row between panel groups: SPACER × panel height, derived from the grid width (padding % = of width). */
const Spacer = styled.div<{ $cols: number; $aspect: number }>`
    grid-column: 1 / -1;
    padding-top: max(
        2px,
        calc(
            (100% - ${({ $cols }) => ($cols - 1) * GAP}px) / ${({ $cols }) => $cols} /
                ${({ $aspect }) => $aspect} * ${SPACER} - ${GAP}px
        )
    );
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
`;
const TitleRow = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
`;
const Title = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const Total = styled.div`
    font-size: 22px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--primary-text-color);
    white-space: nowrap;
`;
const Chips = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;
const Chip = styled.span<{ $tone?: 'warn' | 'group' }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: ${({ $tone }) => ($tone === 'warn' ? '#ffb300' : 'var(--secondary-text-color)')};
    background: ${({ $tone }) =>
        $tone === 'warn'
            ? 'rgba(255, 179, 0, 0.14)'
            : $tone === 'group'
              ? 'rgba(255, 179, 0, 0.08)'
              : 'rgba(127, 127, 127, 0.12)'};
    b {
        font-weight: 600;
        color: ${({ $tone }) => ($tone === 'warn' ? '#ffb300' : 'var(--primary-text-color)')};
    }
`;

const Legend = styled.div`
    margin-top: 12px;
`;
const Bar = styled.div<{ $bg: string }>`
    height: 6px;
    border-radius: 3px;
    background: ${({ $bg }) => $bg};
`;
const Ticks = styled.div`
    position: relative;
    height: 16px;
    font-size: 11px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
`;
const Tick = styled.span<{ $pos: number }>`
    position: absolute;
    top: 3px;
    left: ${({ $pos }) => $pos}%;
    transform: translateX(${({ $pos }) => ($pos < 3 ? '0' : $pos > 97 ? '-100%' : '-50%')});
    white-space: nowrap;
`;

const median = (xs: number[]) => {
    if (xs.length === 0) {
        return 0;
    }
    const s = [...xs].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

type EntityReading = { value: number | undefined; name: string; unit: string | undefined };

/** One hook per unique entity — the caller keys the component by the entity list so the hook order stays fixed. */
function useReadings(entities: string[]): Record<string, EntityReading> {
    const out: Record<string, EntityReading> = {};
    for (const id of entities) {
        // eslint-disable-next-line react-hooks/rules-of-hooks -- stable list, component is keyed by it
        const s = useEntityState({ entityId: id });
        const n = s.isAvailable ? Number.parseFloat(s.state ?? '') : Number.NaN;
        const name =
            typeof s.attributes.friendly_name === 'string' ? s.attributes.friendly_name : id;
        const unit =
            typeof s.attributes.unit_of_measurement === 'string'
                ? s.attributes.unit_of_measurement
                : undefined;
        out[id] = { value: Number.isFinite(n) ? n : undefined, name, unit };
    }
    return out;
}

export type LayoutProps = {
    layout: Layout;
    colors?: ColorStep[] | undefined;
    title?: string;
    showSummary?: boolean;
    showLegend?: boolean;
    showValues?: boolean;
    aspect?: number;
    outlierThreshold?: number;
    groupNames?: string[];
    /** Maximum height of the panel grid in px (fixed card height); the grid shrinks to fit. */
    maxGridHeight?: number;
};

const isSpacerRow = (row: string[]) => row.every((c) => c === '_' || c === '');

const LayoutInner = ({
    entities,
    layout,
    colors,
    title,
    showSummary = true,
    showLegend = true,
    showValues = true,
    aspect = 1,
    outlierThreshold = 0.7,
    groupNames,
    maxGridHeight,
}: LayoutProps & { entities: string[] }) => {
    const readings = useReadings(entities);
    const scale = useMemo(() => buildScale(colors), [colors]);
    const tr = t();

    const cols = Math.max(1, ...layout.map((r) => r.length));
    const unit = entities.map((e) => readings[e]?.unit).find(Boolean) ?? 'W';

    // groups: runs of panel rows separated by rows that contain only `_`
    const groups: string[][] = [];
    let current: string[] = [];
    for (const row of layout) {
        if (isSpacerRow(row)) {
            if (current.length) {
                groups.push(current);
            }
            current = [];
        } else {
            current.push(...row.filter((c) => c && c !== '_'));
        }
    }
    if (current.length) {
        groups.push(current);
    }
    const groupOf = new Map<string, number>();
    groups.forEach((g, i) => g.forEach((e) => groupOf.set(e, i)));
    const groupMedian = groups.map((g) =>
        median(g.map((e) => readings[e]?.value).filter((x): x is number => x !== undefined)),
    );
    const isWeak = (e: string) => {
        const v = readings[e]?.value;
        const m = groupMedian[groupOf.get(e) ?? 0] ?? 0;
        return (
            outlierThreshold > 0 &&
            v !== undefined &&
            m > Math.max(5, scale.max * 0.05) &&
            v < outlierThreshold * m
        );
    };

    const values = entities
        .map((e) => readings[e]?.value)
        .filter((x): x is number => x !== undefined);
    const total = values.reduce((a, b) => a + b, 0);
    const ranked = entities
        .filter((e) => readings[e]?.value !== undefined)
        .sort((a, b) => (readings[b]?.value ?? 0) - (readings[a]?.value ?? 0));
    const weak = entities.filter(isWeak);

    // panel size: the grid fills the width; with a fixed height it is capped (max-width) so that it fits
    const panelRows = layout.filter((r) => !isSpacerRow(r)).length;
    const spacerRows = layout.length - panelRows;
    let maxWidth: number | undefined;
    if (maxGridHeight) {
        const w =
            (maxGridHeight - (layout.length - 1) * GAP) /
            ((panelRows + SPACER * spacerRows) / aspect);
        maxWidth = Math.max(40, cols * w + (cols - 1) * GAP);
    }

    const ticks = scale.stops.filter(
        (s, i, all) =>
            i === 0 ||
            i === all.length - 1 ||
            (s.pos - all[0].pos > 0.1 && all[all.length - 1].pos - s.pos > 0.1),
    );
    const top = ranked[0];
    const bottom = ranked[ranked.length - 1];

    return (
        <div>
            {showSummary && (
                <Header>
                    <TitleRow>
                        <Title>{title ?? ''}</Title>
                        <Total>{formatPower(total, unit)}</Total>
                    </TitleRow>
                    <Chips>
                        {groups.length > 1 &&
                            groups.map((g, i) => (
                                <Chip key={i} $tone="group">
                                    {groupNames?.[i] ?? `#${i + 1}`}{' '}
                                    <b>
                                        {formatPower(
                                            g.reduce((a, e) => a + (readings[e]?.value ?? 0), 0),
                                            unit,
                                        )}
                                    </b>
                                </Chip>
                            ))}
                        {values.length > 0 && (
                            <>
                                <Chip>
                                    {tr.avg} <b>{formatPower(total / values.length, unit)}</b>
                                </Chip>
                                <Chip title={readings[top]?.name}>
                                    {tr.best} <b>{formatPower(readings[top]?.value ?? 0, unit)}</b>
                                </Chip>
                                <Chip title={readings[bottom]?.name}>
                                    {tr.worst}{' '}
                                    <b>{formatPower(readings[bottom]?.value ?? 0, unit)}</b>
                                </Chip>
                            </>
                        )}
                        <Chip>
                            <b>{`${values.length}/${entities.length}`}</b> {tr.active}
                        </Chip>
                        {weak.length > 0 && (
                            <Chip
                                $tone="warn"
                                title={weak.map((e) => readings[e]?.name).join(', ')}
                            >
                                ● <b>{weak.length}</b> {tr.weak}
                            </Chip>
                        )}
                    </Chips>
                </Header>
            )}
            <Grid $cols={cols} style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}>
                {layout.flatMap((row, r) => {
                    if (isSpacerRow(row)) {
                        return [<Spacer key={`s${r}`} $cols={cols} $aspect={aspect} />];
                    }
                    const padded = [
                        ...row,
                        ...Array<string>(Math.max(0, cols - row.length)).fill('_'),
                    ];
                    return padded.map((e, c) => {
                        if (!e || e === '_') {
                            return <div key={`${r}-${c}`} />;
                        }
                        const rd = readings[e];
                        const v = rd?.value;
                        const weakPanel = isWeak(e);
                        const name = rd?.name ?? e;
                        const tip =
                            v === undefined
                                ? `${name}: ${tr.offline}`
                                : `${name}: ${formatPower(v, unit)}${weakPanel ? ` · ${tr.weak} (${tr.median} ${formatPower(groupMedian[groupOf.get(e) ?? 0], unit)})` : ''}`;
                        return (
                            <ModuleComponent
                                key={`${r}-${c}`}
                                entity={e}
                                value={v}
                                color={v === undefined ? '#808080' : scale.color(v)}
                                intensity={v === undefined ? 0 : scale.position(v)}
                                label={v === undefined ? '' : `${Math.round(v)}`}
                                title={tip}
                                weak={weakPanel}
                                showValue={showValues}
                                aspect={aspect}
                            />
                        );
                    });
                })}
            </Grid>
            {showLegend && (
                <Legend>
                    <Bar $bg={scale.css} />
                    <Ticks>
                        {ticks.map((s, i) => (
                            <Tick key={i} $pos={s.pos * 100}>
                                {i === ticks.length - 1
                                    ? formatPower(s.value, unit)
                                    : Math.round(s.value)}
                            </Tick>
                        ))}
                    </Ticks>
                </Legend>
            )}
        </div>
    );
};

export const LayoutComponent = (props: LayoutProps) => {
    const entities = useMemo(
        () => [...new Set(props.layout.flat().filter((id) => id && id !== '_'))],
        [props.layout],
    );
    return <LayoutInner key={entities.join('|')} entities={entities} {...props} />;
};
