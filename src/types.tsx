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
});

export type Layout = string[][];
export type ColorStep = v.InferOutput<typeof colorStepSchema>;
export type SolarLayoutConfig = v.InferOutput<typeof solarLayoutConfigSchema>;
