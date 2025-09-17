import type { AppAction, AppState } from '../types';


export const initialState: AppState = {
theme: 'system',
language: 'en',
role: 'Analyst',
org: 'Acme Corp',
sidebarOpen: true,
notifications: 3,
messages: 1,
};


export function appReducer(state: AppState, action: AppAction): AppState {
switch (action.type) {
case 'SET_THEME':
return { ...state, theme: action.payload };
case 'SET_LANGUAGE':
return { ...state, language: action.payload };
case 'SET_ROLE':
return { ...state, role: action.payload };
case 'SET_ORG':
return { ...state, org: action.payload };
case 'TOGGLE_SIDEBAR':
return { ...state, sidebarOpen: !state.sidebarOpen };
case 'SET_SIDEBAR':
return { ...state, sidebarOpen: action.payload };
case 'SET_NOTIFICATIONS':
return { ...state, notifications: action.payload };
case 'SET_MESSAGES':
return { ...state, messages: action.payload };
default:
return state;
}
}