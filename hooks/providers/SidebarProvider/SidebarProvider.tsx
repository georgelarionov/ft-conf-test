import React, { createContext, useContext, useState, useRef } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setSidebarOpen: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isBlocked = useRef(false);

  const setSidebarOpen = (newState: boolean) => {

    setIsOpen(newState);
    isBlocked.current = true;
  };

  return (
    <SidebarContext.Provider value={{ isOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
