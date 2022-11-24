import React from 'react';


const Button = (props: {name: string}) => {
    return <button type={'submit'}
        style={{ borderRadius: '5%', padding: '1em', cursor: 'pointer', textTransform: 'uppercase', lineHeight: '0em', height: '1.2em', fontSize: '1.2em', border: 'none', background: 'grey', color: 'white' }}

    >{props.name}</button>
}

export default Button;