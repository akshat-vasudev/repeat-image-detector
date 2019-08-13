import React from 'react';
let City = (props) => {

    return (
        <article onClick={props.handleUserClick}>
            {props.city}
        </article>
    )
}

export default City;