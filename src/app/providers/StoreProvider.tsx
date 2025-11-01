import React from 'react';
import { mockStore } from '../../store/mockStore';

const StoreContext = React.createContext(mockStore);

export function useStore() {
  return React.useContext(StoreContext);
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <StoreContext.Provider value={mockStore}>{children}</StoreContext.Provider>;
}
