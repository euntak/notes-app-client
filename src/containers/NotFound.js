import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    {
        padding-top: 100px;
        text-align: center;
    }
`;

const NotFound = () => {
    return (
        <Wrapper>
            <h3>Sorry, page Not Found!</h3>
        </Wrapper>
    );
};

export default NotFound;