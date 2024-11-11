import React from "react";

export default function Button(props: {
    children: React.ReactNode;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
}): React.JSX.Element {
    let color = "blue";
    switch (props.type) {
        case "submit":
            color = "green";
            break;
        case "reset":
            color = "red";
            break;
        default:
            color = "blue";
            break;
    }
    const buttonClass = `p-2 text-white rounded bg-${color}-500 hover:bg-${color}-700`
    return (
        <button
            onClick={props.onClick}
            className={buttonClass}
        >
            {props.children}
        </button>
    );
}