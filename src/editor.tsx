import { CSSProperties, useId, useMemo, useState } from 'react';

import { EditorProps } from '@maczejka/hass-react';
import tinycolor from 'tinycolor2';

import { ColorStep, SolarLayoutConfig } from './types';

// ---------------------------------------------------------------------------
// Entity color palette
// ---------------------------------------------------------------------------

const PALETTE = [
    '#4CAF50',
    '#2196F3',
    '#FF9800',
    '#9C27B0',
    '#F44336',
    '#00BCD4',
    '#8BC34A',
    '#795548',
    '#E91E63',
    '#3F51B5',
    '#CDDC39',
    '#607D8B',
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = {
    editor: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontSize: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#333',
    } satisfies CSSProperties,
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    } satisfies CSSProperties,
    sectionTitle: {
        fontWeight: 700,
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#888',
        borderBottom: '1px solid #eee',
        paddingBottom: '4px',
    } satisfies CSSProperties,

    // --- Layout ---
    brushRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
    } satisfies CSSProperties,
    brushLabel: {
        fontSize: '11px',
        color: '#666',
        whiteSpace: 'nowrap',
    } satisfies CSSProperties,
    brushInput: {
        flex: 1,
        minWidth: '120px',
        padding: '4px 6px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        fontSize: '11px',
        fontFamily: 'monospace',
    } satisfies CSSProperties,
    brushSwatch: {
        width: '14px',
        height: '14px',
        borderRadius: '2px',
        border: '1px solid rgba(0,0,0,0.15)',
        flexShrink: 0,
    } satisfies CSSProperties,
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
    } satisfies CSSProperties,
    gridRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
    } satisfies CSSProperties,
    cell: {
        width: '28px',
        height: '28px',
        borderRadius: '3px',
        border: '2px solid',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        transition: 'opacity 0.1s',
    } satisfies CSSProperties,
    cellEmpty: {
        backgroundColor: '#f5f5f5',
        borderColor: '#ddd',
        borderStyle: 'dashed',
    } satisfies CSSProperties,
    rowBtn: {
        width: '20px',
        height: '20px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
        fontSize: '12px',
        lineHeight: '18px',
        textAlign: 'center',
        padding: 0,
        color: '#888',
        flexShrink: 0,
    } satisfies CSSProperties,
    addBtn: {
        padding: '4px 10px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
        fontSize: '11px',
        color: '#666',
        alignSelf: 'flex-start',
    } satisfies CSSProperties,
    legend: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginTop: '4px',
    } satisfies CSSProperties,
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    } satisfies CSSProperties,
    legendSwatch: {
        width: '10px',
        height: '10px',
        borderRadius: '2px',
        border: '1px solid rgba(0,0,0,0.1)',
        flexShrink: 0,
    } satisfies CSSProperties,
    legendText: {
        fontSize: '10px',
        fontFamily: 'monospace',
        color: '#666',
        maxWidth: '120px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    } satisfies CSSProperties,

    // --- Colors ---
    gradientBar: {
        height: '16px',
        borderRadius: '4px',
        border: '1px solid rgba(0,0,0,0.1)',
    } satisfies CSSProperties,
    colorRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    } satisfies CSSProperties,
    colorPicker: {
        width: '28px',
        height: '24px',
        padding: '1px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        cursor: 'pointer',
        flexShrink: 0,
    } satisfies CSSProperties,
    colorLabel: {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#666',
        minWidth: '60px',
    } satisfies CSSProperties,
    valueLabel: {
        fontSize: '11px',
        color: '#888',
        whiteSpace: 'nowrap',
    } satisfies CSSProperties,
    numberInput: {
        width: '56px',
        padding: '3px 5px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        fontSize: '11px',
        fontFamily: 'monospace',
        textAlign: 'right',
    } satisfies CSSProperties,
    removeBtn: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#bbb',
        fontSize: '14px',
        padding: '0 2px',
        lineHeight: 1,
    } satisfies CSSProperties,

    // --- Size ---
    sizeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    } satisfies CSSProperties,
    sizeLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        color: '#666',
    } satisfies CSSProperties,
    sizeSep: {
        fontSize: '11px',
        color: '#bbb',
    } satisfies CSSProperties,
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        color: '#666',
        cursor: 'pointer',
    } satisfies CSSProperties,
    checkbox: {
        margin: 0,
    } satisfies CSSProperties,
};

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

export const SolarLayoutEditor = ({ config, onChange, hass }: EditorProps<SolarLayoutConfig>) => {
    const [brushEntity, setBrushEntity] = useState('');
    const datalistId = useId();

    const availableEntities = useMemo(() => Object.keys(hass.states), [hass.states]);

    // Map unique layout entities → palette colors
    const entityColorMap = useMemo(() => {
        const unique = [...new Set(config.layout.flat().filter((id) => id !== '_'))];
        return Object.fromEntries(unique.map((e, i) => [e, PALETTE[i % PALETTE.length]]));
    }, [config.layout]);

    // ---- Layout handlers ---------------------------------------------------

    const setCell = (row: number, col: number, value: string) => {
        const next = config.layout.map((r, i) =>
            i === row ? r.map((c, j) => (j === col ? value : c)) : [...r],
        );
        onChange({ ...config, layout: next });
    };

    const toggleCell = (row: number, col: number) => {
        const current = config.layout[row][col];
        if (current === '_') {
            if (brushEntity) setCell(row, col, brushEntity);
        } else {
            setCell(row, col, '_');
        }
    };

    const addRow = () => {
        const cols = Math.max(...config.layout.map((r) => r.length), 1);
        onChange({
            ...config,
            layout: [...config.layout, Array<string>(cols).fill('_')],
        });
    };

    const removeRow = (idx: number) => {
        onChange({ ...config, layout: config.layout.filter((_, i) => i !== idx) });
    };

    const addCellToRow = (rowIdx: number) => {
        const next = config.layout.map((r, i) => (i === rowIdx ? [...r, '_'] : [...r]));
        onChange({ ...config, layout: next });
    };

    const removeCellFromRow = (rowIdx: number) => {
        if (config.layout[rowIdx].length <= 0) return;
        const next = config.layout.map((r, i) => (i === rowIdx ? r.slice(0, -1) : [...r]));
        onChange({ ...config, layout: next });
    };

    // ---- Color handlers ----------------------------------------------------

    const updateColorStop = (idx: number, patch: Partial<ColorStep>) => {
        const next = config.colors.map((c, i) => (i === idx ? { ...c, ...patch } : c));
        onChange({ ...config, colors: next });
    };

    const addColorStop = () => {
        const maxVal = Math.max(...config.colors.map((c) => c.value ?? 0), 0);
        onChange({
            ...config,
            colors: [...config.colors, { color: '#808080', value: maxVal + 100 }],
        });
    };

    const removeColorStop = (idx: number) => {
        onChange({
            ...config,
            colors: config.colors.filter((_, i) => i !== idx),
        });
    };

    // ---- Size handlers -----------------------------------------------------

    const updateSize = (key: 'width' | 'height', raw: string) => {
        const num = Number.parseInt(raw, 10);
        onChange({
            ...config,
            size: {
                ...config.size,
                [key]: Number.isNaN(num) ? undefined : num,
            },
        });
    };

    // ---- Gradient CSS -------------------------------------------------------

    const gradientCss = useMemo(() => {
        if (config.colors.length === 0) return '#ccc';
        if (config.colors.length === 1) return config.colors[0].color;
        const sorted = [...config.colors].sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
        const minVal = sorted[0].value ?? 0;
        const maxVal = sorted[sorted.length - 1].value ?? 0;
        const range = maxVal - minVal || 1;
        const stops = sorted.map((c) => {
            const pct = (((c.value ?? 0) - minVal) / range) * 100;
            return `${c.color} ${pct}%`;
        });
        return `linear-gradient(to right, ${stops.join(', ')})`;
    }, [config.colors]);

    // ---- Render -------------------------------------------------------------

    return (
        <div style={s.editor}>
            {/* ---- Layout ---- */}
            <div style={s.section}>
                <div style={s.sectionTitle}>Layout</div>

                <div style={s.brushRow}>
                    <span style={s.brushLabel}>Paint:</span>
                    <input
                        list={datalistId}
                        style={s.brushInput}
                        value={brushEntity}
                        onChange={(e) => setBrushEntity(e.target.value)}
                        placeholder="Pick entity to paint..."
                    />
                    <datalist id={datalistId}>
                        {availableEntities.map((id) => (
                            <option key={id} value={id} />
                        ))}
                    </datalist>
                    {brushEntity && (
                        <div
                            style={{
                                ...s.brushSwatch,
                                backgroundColor:
                                    entityColorMap[brushEntity] ??
                                    PALETTE[Object.keys(entityColorMap).length % PALETTE.length],
                            }}
                        />
                    )}
                </div>

                <div style={s.grid}>
                    {config.layout.map((row, rowIdx) => (
                        <div key={rowIdx} style={s.gridRow}>
                            {row.map((cell, colIdx) => {
                                const active = cell !== '_';
                                return (
                                    <button
                                        key={colIdx}
                                        type="button"
                                        style={{
                                            ...s.cell,
                                            ...(active
                                                ? {
                                                      backgroundColor:
                                                          entityColorMap[cell] ?? '#4CAF50',
                                                      borderColor:
                                                          entityColorMap[cell] ?? '#4CAF50',
                                                  }
                                                : s.cellEmpty),
                                        }}
                                        title={active ? cell : 'Click to place entity'}
                                        onClick={() => toggleCell(rowIdx, colIdx)}
                                    />
                                );
                            })}
                            <button
                                type="button"
                                style={s.rowBtn}
                                onClick={() => addCellToRow(rowIdx)}
                                title="Add cell"
                            >
                                +
                            </button>
                            {row.length > 0 && (
                                <button
                                    type="button"
                                    style={s.rowBtn}
                                    onClick={() => removeCellFromRow(rowIdx)}
                                    title="Remove cell"
                                >
                                    -
                                </button>
                            )}
                            <button
                                type="button"
                                style={{
                                    ...s.rowBtn,
                                    color: '#d32f2f',
                                    marginLeft: '2px',
                                }}
                                onClick={() => removeRow(rowIdx)}
                                title="Remove row"
                            >
                                x
                            </button>
                        </div>
                    ))}
                </div>

                <button type="button" style={s.addBtn} onClick={addRow}>
                    + Add row
                </button>

                {Object.keys(entityColorMap).length > 0 && (
                    <div style={s.legend}>
                        {Object.entries(entityColorMap).map(([entity, color]) => (
                            <div key={entity} style={s.legendItem}>
                                <div
                                    style={{
                                        ...s.legendSwatch,
                                        backgroundColor: color,
                                    }}
                                />
                                <span style={s.legendText}>{entity}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ---- Colors ---- */}
            <div style={s.section}>
                <div style={s.sectionTitle}>Color gradient</div>

                <div style={{ ...s.gradientBar, background: gradientCss }} />

                {config.colors.map((color, idx) => (
                    <div key={idx} style={s.colorRow}>
                        <input
                            type="color"
                            style={s.colorPicker}
                            value={tinycolor(color.color).toHexString()}
                            onChange={(e) =>
                                updateColorStop(idx, {
                                    color: e.target.value,
                                })
                            }
                        />
                        <span style={s.colorLabel}>{color.color}</span>
                        <span style={s.valueLabel}>val</span>
                        <input
                            type="number"
                            style={s.numberInput}
                            value={color.value ?? ''}
                            onChange={(e) =>
                                updateColorStop(idx, {
                                    value: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        />
                        <button
                            type="button"
                            style={s.removeBtn}
                            onClick={() => removeColorStop(idx)}
                            title="Remove stop"
                        >
                            x
                        </button>
                    </div>
                ))}

                <button type="button" style={s.addBtn} onClick={addColorStop}>
                    + Add color stop
                </button>
            </div>

            {/* ---- Size ---- */}
            <div style={s.section}>
                <div style={s.sectionTitle}>Size</div>
                <label style={s.checkboxLabel}>
                    <input
                        type="checkbox"
                        style={s.checkbox}
                        checked={!config.size?.width && !config.size?.height}
                        onChange={(e) =>
                            onChange({
                                ...config,
                                size: e.target.checked ? undefined : { width: 320, height: 200 },
                            })
                        }
                    />
                    Fit container
                </label>
                {(config.size?.width || config.size?.height) && (
                    <div style={s.sizeRow}>
                        <label style={s.sizeLabel}>
                            W
                            <input
                                type="number"
                                style={s.numberInput}
                                value={config.size?.width ?? ''}
                                onChange={(e) => updateSize('width', e.target.value)}
                                placeholder="auto"
                            />
                        </label>
                        <span style={s.sizeSep}>x</span>
                        <label style={s.sizeLabel}>
                            H
                            <input
                                type="number"
                                style={s.numberInput}
                                value={config.size?.height ?? ''}
                                onChange={(e) => updateSize('height', e.target.value)}
                                placeholder="auto"
                            />
                        </label>
                        <span style={s.sizeSep}>px</span>
                    </div>
                )}
            </div>
        </div>
    );
};
