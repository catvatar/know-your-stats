import React, { useEffect } from 'react';

export default function PopupWrapper(props:{ 
    children: React.ReactNode, 
    isOpen: boolean,
    className?: string, 
    focusRef?: React.RefObject<HTMLInputElement>
}): React.JSX.Element {

    useEffect(() => {
        if (props.isOpen && props.focusRef?.current) {
            props.focusRef?.current.focus();
        }
    }, [props.isOpen]);
    

    return (
        props.isOpen ? <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className={'bg-gray-800 p-4 rounded shadow-md ${props.className}'}>
                {props.children}
            </div>
        </div> : (<></>)
    )
}