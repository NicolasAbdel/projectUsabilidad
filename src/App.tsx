import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import LessonUnit from './pages/LessonUnit';
import Exercise from './pages/Exercise';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';

function App() {
  return (
    <UserProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/unit/:unitId" element={<LessonUnit />} />
              <Route path="/exercise/:exerciseId" element={<Exercise />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;