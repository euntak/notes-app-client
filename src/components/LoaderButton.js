import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

const LoaderButton = ({ isLoading, text, loadingText, disabled = false, ...props }) => {
    return (
        <Button disabled={disabled || isLoading} {...props}>
            { isLoading && <Glyphicon glyph='refresh' className='spinning'/> }
            { !isLoading ? text : loadingText }
        </Button>
    );
};

export default LoaderButton;