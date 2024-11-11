import React from "react";
import Button from "../utils/components/Button";
import PopupWrapper from "../utils/components/PopupWrapper";

export default function ButtonWithPopup({ children, popup }: { children: React.ReactNode, popup: React.ReactNode }): React.JSX.Element {
    const [isPopupOpen, setIsPopupOpen] = React.useState<boolean>(false);

    return (
        <>
            <Button onClick={() => setIsPopupOpen(!isPopupOpen)}>
                {children}
            </Button>
            <PopupWrapper isOpen={isPopupOpen}>
                {popup}
            </PopupWrapper>
        </>
    );
}