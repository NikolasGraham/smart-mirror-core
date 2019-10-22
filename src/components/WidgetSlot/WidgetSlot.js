import React from "react";
import PropTypes from "prop-types";

const WidgetSlot = (props) => {

    return (
        <div
            style={{
                border: "dashed",
            }}
        >
            {
                props.widget
            }
        </div>
    )

}

WidgetSlot.propTypes = {
    widget: PropTypes.func.isRequired
}

export default WidgetSlot;