import React from 'react';
import { useApp } from '@/store/AppContext';

const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-4'>Settings</h1>
      <p>Theme: {state.theme}</p>
      <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })} className='px-3 py-2 border rounded mt-2'>
        Toggle Theme
      </button>
    </div>
  );
};
export default Settings;
