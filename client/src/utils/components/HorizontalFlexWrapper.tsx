import React from "react";

export default function HorizontalFlexWrapper({ children, className }: { children: React.ReactNode, className?: string }): React.JSX.Element {
    return (
        <div className={`flex group items-center ${className}`}>
            {children}
        </div>);
}