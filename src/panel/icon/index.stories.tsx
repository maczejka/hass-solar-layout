import styled from 'styled-components';

import { PanelIcon } from './index';

export default {
    Component: PanelIcon,
};

const Wrapper = styled.div`
    width: 400px;
    height: 400px;
`;

export const Icon4x4 = () => {
    return (
        <Wrapper>
            <PanelIcon color="deepskyblue" />
        </Wrapper>
    );
};

export const Icon2x2 = () => {
    return (
        <Wrapper>
            <PanelIcon color="deepskyblue" />
        </Wrapper>
    );
};

export const Icon16x16 = () => {
    return (
        <Wrapper>
            <PanelIcon color="deepskyblue" />
        </Wrapper>
    );
};
