import React from 'react'

interface IOverlayProp {
  children: React.ReactNode;
  isOpen: boolean;
}

export const Overlay = ({ children, isOpen }: IOverlayProp) => {
  return (
    <div className={`bg-overlay fixed top-0 z-44 right-0 bottom-0 left-0 ${isOpen ? `block h-[100vh] w-[100vw] overlay` : 'hidden'}`}>
      {children}
    </div>
  )
};
