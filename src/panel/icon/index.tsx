import { PropsWithChildren } from 'react';

import useDimensions from 'react-cool-dimensions';
import styled from 'styled-components';

import { CollectorElement } from './collector-element';

const ELEMENT_SIZE = 6;
const MIN_ELEMENTS = 1;

type PanelIconProps = PropsWithChildren<{
    color: string;
}>;

const Container = styled.div<{ columns: number; maxHeight: number }>`
    display: grid;
    grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
    gap: 1%;
    padding: 2%;
    border: 2px solid lightgray;
    border-radius: 5px;
    width: 100%;
    height: ${({ maxHeight }) => maxHeight}px;
    position: relative;
`;

const Overlay = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PanelIcon = ({ color, children }: PanelIconProps) => {
    const { observe, width: dWidth, height: dHeight } = useDimensions();

    const width = Math.max(dWidth, ELEMENT_SIZE);
    const height = Math.max(dHeight, ELEMENT_SIZE);

    const rows = Math.max(MIN_ELEMENTS * ELEMENT_SIZE, Math.floor(height / ELEMENT_SIZE));
    const columns = Math.max(MIN_ELEMENTS * ELEMENT_SIZE, Math.floor(width / ELEMENT_SIZE));

    const getMode = (row: number, column: number) => {
        if (rows !== columns) {
            return 'full';
        }

        const size = rows - 1;

        if (row + column === size) {
            return 'half';
        }
        if (row + column > size) {
            return 'shaded';
        }
        return 'full';
    };

    return (
        <Container ref={observe} columns={columns} maxHeight={width}>
            {[...Array(rows).keys()].map((row) => {
                return [...Array(columns).keys()].map((column) => {
                    return (
                        <CollectorElement
                            key={`${row}-${column}`}
                            color={color}
                            mode={getMode(row, column)}
                        />
                    );
                });
            })}
            <Overlay>{children}</Overlay>
        </Container>
    );
};
