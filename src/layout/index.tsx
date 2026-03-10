import { max } from 'lodash';
import flatten from 'lodash/flatten';
import styled from 'styled-components';

import { PanelComponent } from '../panel';
import { ColorStep, Layout } from '../types';

const LayoutWrapper = styled.div<{ cols: number }>`
    width: 100%;
    height: 100%;
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
    box-sizing: border-box;
    align-content: flex-start;
    gap: 2%;
`;

type Props = {
    layout: Layout;
    colors?: ColorStep[] | undefined;
};

export const LayoutComponent = ({ layout, colors }: Props) => {
    const numCols = max(layout.map((row) => row.length)) || 0;

    const paddedLayout = layout.map((row) => {
        if (row.length === numCols) {
            return row;
        }
        return [...row, ...Array.from(Array(numCols - row.length)).map(() => '_')];
    });

    return (
        <LayoutWrapper cols={numCols}>
            {flatten(paddedLayout).map((panel) => {
                if (panel === '_') {
                    return <div key={panel} />;
                }
                return <PanelComponent key={panel} entity={panel} colors={colors} />;
            })}
        </LayoutWrapper>
    );
};
