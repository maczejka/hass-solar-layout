import * as v from 'valibot';

export const colorStepSchema = v.object({
    color: v.string(),
    value: v.optional(v.number()),
});

export const solarLayoutConfigSchema = v.object({
    layout: v.array(v.array(v.string())),
    colors: v.array(colorStepSchema),
    size: v.optional(
        v.object({
            width: v.optional(v.number()),
            height: v.optional(v.number()),
        }),
    ),
    /** Card title shown in the summary header. */
    title: v.optional(v.string()),
    /** Header with total / average / best / weakest panel and per-group sums. Default: true. */
    show_summary: v.optional(v.boolean()),
    /** Gradient legend below the panels. Default: true. */
    show_legend: v.optional(v.boolean()),
    /** Value printed on each panel. Default: true. */
    show_values: v.optional(v.boolean()),
    /** Panel width / height, e.g. 0.6 for portrait modules. Default: 1 (square). */
    aspect_ratio: v.optional(v.number()),
    /**
     * Mark a panel when it delivers less than this share of its group's median (0–1, 0 = off). Default: 0.7.
     * Groups are separated by rows that contain only `_`.
     */
    outlier_threshold: v.optional(v.number()),
    /** Names for the groups (top to bottom), shown with their sums in the header. */
    group_names: v.optional(v.array(v.string())),
});

export type Layout = string[][];
export type ColorStep = v.InferOutput<typeof colorStepSchema>;
export type SolarLayoutConfig = v.InferOutput<typeof solarLayoutConfigSchema>;
