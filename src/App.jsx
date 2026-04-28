import { BrowserRouter, Routes, Route } from 'react-router';
import LoginForm from './components/LoginForm';
import ProjectList from './components/ProjectList';
import FarmerDetails from './components/FarmerDetails';
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";
import CreateProject from './projects/CreateProject';
import AssignUsers from './projects/AssignUsers';
import ShowAgronomist from './projects/ShowAgronomist';
// admin import
import AdminDashboard from './Admin/AdminDashboard';
import UserList from './Admin/UserList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
          {/* Admin-specific routes can be nested here */}
          <Route path='/admin/users' element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
        </Route>

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