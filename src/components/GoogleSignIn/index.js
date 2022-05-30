import React from 'react';
import { GOOGLE_CLIENT_ID } from '../../config';

export default function GoogleSignIn(props) {

    // function for handle google token
    const { callback } = props;

    // div for google render button
    const googleDivRef = React.useRef(null);

    // setup google sign in when page is loaded
    React.useEffect(() => {
        if (!googleDivRef.current || !window.google) return;
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: callback
        });
        window.google.accounts.id.renderButton(googleDivRef.current, {
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            // shape: "pill",
            width: '1000',
        });
    }, [googleDivRef.current])

    return (
        <div ref={googleDivRef} />
    )
}
