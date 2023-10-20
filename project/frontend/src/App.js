import { Toaster } from 'react-hot-toast';
import { CalendarProvider } from './contexts/CalendarContext';
import Calendar from './components/calendar/Calendar';
import SideControls from './components/sidecontrols/SideControls';

function App() {
	return (
		<>
			<Toaster />
			<CalendarProvider>
				<div 
					className="w-screen h-screen grid grid-cols-1 md:grid-cols-[1fr,2fr] grid-rows-[auto,1fr] md:grid-rows-1"
				>
					<SideControls />
					<Calendar />
				</div>
			</CalendarProvider>
		</>
	);
}

export default App;
