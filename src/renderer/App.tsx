import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0)
  const [versionInfo, setVersionInfo] = useState<string>('...');

  /// Get version info from main process.
  useEffect(() => {
    const getInfo = async () => {
      const info = await window.myAPI.getVersionInfo();
      setVersionInfo(info);
    };

    getInfo();
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p style={{ fontSize: '0.9rem' }}>
        {versionInfo}
      </p>
    </div>
  )
}

export default App;
