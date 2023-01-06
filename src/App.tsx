import './App.css'
import { ExtensionContextProvider } from './extension-context'
import { AppContextProvider } from './app-context'
import MediaGallery from './media-gallery'

function App() {
	return (
		<ExtensionContextProvider>
			<AppContextProvider>
				<div className='App'>
					<header className='App-header'>
						<MediaGallery />
					</header>
				</div>
			</AppContextProvider>
		</ExtensionContextProvider>
	)
}

export default App
