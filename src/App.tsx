import './App.css'
import { ExtensionContextProvider } from './extension-context'
import { AppContextProvider } from './app-context'
import MediaGallery from './media-gallery'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<ExtensionContextProvider>
				<AppContextProvider>
					<div className='App'>
						<header className='App-header'>
							<MediaGallery />
						</header>
					</div>
				</AppContextProvider>
			</ExtensionContextProvider>
		</LocalizationProvider>
	)
}

export default App
