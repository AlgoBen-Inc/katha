import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Deck } from './components/Deck';
import { Overview } from './components/Overview';
import { PresenterController } from './components/Presenter/PresenterController';
import { PrintView } from './components/Print/PrintView';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/1" replace />} />
          <Route path="/presenter/:slideIndex" element={<PresenterController />} />
          <Route path="/print" element={<PrintView />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/:slideIndex" element={<Deck />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
