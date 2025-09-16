export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi';
export type Role = 'Admin' | 'Manager' | 'Analyst' | 'Viewer';
export type Org = 'Acme Corp' | 'Globex' | 'Initech' | 'Umbrella';


export interface AppState {
theme: Theme;
language: Language;
role: Role;
org: Org;
sidebarOpen: boolean;
notifications: number;
messages: number;
}


export type AppAction =
| { type: 'SET_THEME'; payload: Theme }
| { type: 'SET_LANGUAGE'; payload: Language }
| { type: 'SET_ROLE'; payload: Role }
| { type: 'SET_ORG'; payload: Org }
| { type: 'TOGGLE_SIDEBAR' }
| { type: 'SET_SIDEBAR'; payload: boolean }
| { type: 'SET_NOTIFICATIONS'; payload: number }
| { type: 'SET_MESSAGES'; payload: number };