import "./App.css"
import { ExtensionContextProvider } from "./extension-context";
import MediaGallery from "./media-gallery";

function App() {
  return (
    <ExtensionContextProvider>
      <div className="App">
        <header className="App-header">
          <MediaGallery />
        </header>
      </div>
    </ExtensionContextProvider>
  );
}

export default App;
