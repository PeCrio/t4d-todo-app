import React from 'react'

interface IOverlayProp {
    children: React.ReactNode;
    isOpen: boolean;
}
const Overlay = ({ children, isOpen }: IOverlayProp) => {
  return (
    <div className={`bg-overlay absolute top-0 z-[10] right-0 bottom-0 left-0 ${isOpen ? 'block h-[100vh] w-[100vw]' : 'hidden'}`}>
        {children}
    </div>
  )
}

export default Overlay