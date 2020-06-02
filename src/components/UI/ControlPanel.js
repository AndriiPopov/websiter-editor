import React from 'react'

export default props => (
    <div
        style={{
            background: '#eee',
            paddingLeft: '10px',
            borderBottom: '1px solid #ccc',
            marginBottom: '20px',
        }}
    >
        {props.children}
    </div>
)
