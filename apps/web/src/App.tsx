import { Route, Routes } from 'react-router-dom';

import { LandingNavbar } from './components';
import { HomePage } from './pages';

function App() {
  return (
    <>
      <LandingNavbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
      </Routes>
    </>
  );
}

export default App;