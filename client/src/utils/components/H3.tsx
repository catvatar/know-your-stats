import React from "react";

export default function H3({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <h3 className="text-xl font-semibold">{children}</h3>
    );
}