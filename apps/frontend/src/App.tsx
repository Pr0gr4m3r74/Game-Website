import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AvatarEditor from './pages/AvatarEditor';
import Cosmetics from './pages/Cosmetics';
import Marketplace from './pages/Marketplace';
import Worlds from './pages/Worlds';
import Admin from './pages/Admin';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/avatar-editor"
          element={
            <ProtectedRoute>
              <AvatarEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cosmetics"
          element={
            <ProtectedRoute>
              <Cosmetics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worlds"
          element={
            <ProtectedRoute>
              <Worlds />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
