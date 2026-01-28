import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Deck } from './components/Deck';
import { PresenterController } from './components/Presenter/PresenterController';
import { PrintView } from './components/Print/PrintView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/1" replace />} />
        <Route path="/presenter/:slideIndex" element={<PresenterController />} />
        <Route path="/print" element={<PrintView />} />
        <Route path="/:slideIndex" element={<Deck />} />
      </Routes>
    </Router>
  );
}

export default App;
