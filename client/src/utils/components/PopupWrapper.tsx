import React from 'react';

export default function PopupWrapper({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {
    return (
        isOpen ? <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            {children}
        </div> : null
    )
}