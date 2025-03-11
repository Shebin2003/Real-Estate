import React from "react";

import UserContext from './UserContext'

const UserState = (props) =>{
    const states = []
    return (
        <UserContext.Provider value={states}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState