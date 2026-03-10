import styled from 'styled-components';

import { CollectorElement } from './index';

export default {
    Component: CollectorElement,
};

const Wrapper = styled.div`
    width: 400px;
    height: 400px;
`;

export const Full = () => {
    return (
        <Wrapper>
            <CollectorElement color="red" mode="full" />
        </Wrapper>
    );
};

export const Half = () => {
    return (
        <Wrapper>
            <CollectorElement color="red" mode="half" />
        </Wrapper>
    );
};

export const Shaded = () => {
    return (
        <Wrapper>
            <CollectorElement color="red" mode="shaded" />
        </Wrapper>
    );
};
