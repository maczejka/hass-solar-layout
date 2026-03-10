export type Layout = string[][];

export type ColorStep = {
    value?: number;
    color: string;
};

export type SolarLayoutConfig = {
    layout: Layout;
    colors: ColorStep[];
    size?: {
        width?: number;
        height?: number;
    };
};
