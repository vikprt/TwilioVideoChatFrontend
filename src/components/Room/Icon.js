import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = ({icon, onClick}) => {
    return (
        <div className="video-icon" onClick={onClick}>
            <FontAwesomeIcon icon={icon} size="3x" />
        </div>
    )
}

export default Icon;