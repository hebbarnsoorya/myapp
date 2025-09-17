import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import App from '@/App';


const setup = () => render(
<BrowserRouter>
<AppProvider>
<App />
</AppProvider>
</BrowserRouter>
);


test('renders header and toggles sidebar', () => {
setup();
expect(screen.getByText(/Endava Portal/i)).toBeInTheDocument();
const toggle = screen.getByTitle('Toggle sidebar');
fireEvent.click(toggle);
// No assertion on style; just ensure clickable without crash
});