import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { appReducer, initialState } from './appReducer';
import type { AppAction, AppState, Theme } from '@/types';
import useLocalStorage from '@/hooks/useLocalStorage';


interface AppContextValue { state: AppState; dispatch: React.Dispatch<AppAction>; }


const AppContext = createContext<AppContextValue | null>(null);
export default AppContext;


export function useApp() {
const ctx = useContext(AppContext);
if (!ctx) throw new Error('useApp must be used within AppProvider');
return ctx;
}


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [persisted, setPersisted] = useLocalStorage<AppState>('app-state', initialState);
const [state, dispatch] = useReducer(appReducer, persisted);


useEffect(() => setPersisted(state), [state, setPersisted]);


// Apply theme to document
useEffect(() => {
const root = document.documentElement;
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const mode: Theme = state.theme === 'system' ? (prefersDark ? 'dark' : 'light') : state.theme;
root.classList.toggle('dark', mode === 'dark');
}, [state.theme]);


const value = useMemo(() => ({ state, dispatch }), [state]);
return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};