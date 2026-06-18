import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          <Route path="users" element={<UserList />} />
          <Route path="dashboard" element={<ProjectList />} />
        </Route>

        {/* Protected Routes with Constant Header/Footer */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<ProjectList />} />
          <Route path="/projects/:_id" element={<FarmerDetails />} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/assign/:id" element={<AssignUsers />} />
          <Route path="/projects/agronomist/:id" element={<ShowAgronomist />} />
        </Route>

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;