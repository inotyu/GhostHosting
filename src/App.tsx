import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Overview from './pages/Overview/Overview';
import Upload from './pages/Upload/Upload';
import Gallery from './pages/Gallery/Gallery';
import Folders from './pages/Folders/Folders';
import './styles/globals.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/image-host/overview" element={<Overview />} />
          <Route path="/image-host/upload" element={<Upload />} />
          <Route path="/image-host/gallery" element={<Gallery />} />
          <Route path="/image-host/folders" element={<Folders />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
