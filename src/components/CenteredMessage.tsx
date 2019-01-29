import * as React from "react";

const CenteredMessage = ({text}:{text: string}) =>
    <div style={{
        textAlign: 'center',
        color: '#ECDC00',
        fontSize: 24
    }}>
        {text}
    </div>;

export default CenteredMessage
