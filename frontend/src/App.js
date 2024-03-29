import { Toaster } from 'react-hot-toast';
import { SideControlsProvider } from './contexts/SideControlsContext';
import { CalendarProvider } from './contexts/CalendarContext';
import Calendar from './components/calendar/Calendar';
import SideControls from './components/sidecontrols/SideControls';
import dayjs from 'dayjs';
import 'dayjs/locale/de-at';

function App() {
	dayjs.locale('de-at');

	return (
		<>
			<Toaster />
			<CalendarProvider>
				<div 
					className="w-screen h-screen grid grid-cols-1 md:grid-cols-[1fr,2fr] grid-rows-[auto,1fr] md:grid-rows-1"
				>
					<SideControlsProvider>
						<SideControls />
					</SideControlsProvider>

					<Calendar />
				</div>
			</CalendarProvider>
		</>
	);
}

export default App;
