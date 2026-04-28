import { BrowserRouter, Routes, Route } from 'react-router';
import LoginForm from './components/LoginForm';
import ProjectList from './components/ProjectList';
import FarmerDetails from './components/FarmerDetails';
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";
import CreateProject from './projects/CreateProject';
import AssignUsers from './projects/AssignUsers';
import ShowAgronomist from './projects/ShowAgronomist';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected Routes with Constant Header/Footer */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
          <Route path="/projects/:_id" element={<ProtectedRoute><FarmerDetails /></ProtectedRoute>} />
          <Route path="/projects/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
          <Route path="/projects/assign/:id" element={<ProtectedRoute><AssignUsers /></ProtectedRoute>} />
          <Route path="/projects/agronomist/:id" element={<ProtectedRoute><ShowAgronomist /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;