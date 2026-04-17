import { BrowserRouter, Routes, Route } from 'react-router';
import LoginForm from './components/LoginForm';
import Sidebar from './Sidebar';
import FarmerDetails from './components/FarmerDetails';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/sidebar" element={<ProtectedRoute><Sidebar /></ProtectedRoute>} />
        <Route path="/farmers/:_id" element={<ProtectedRoute><FarmerDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;