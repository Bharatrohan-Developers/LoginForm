import { BrowserRouter, Routes, Route } from 'react-router';
import LoginForm from './components/LoginForm';
import ProjectList from './components/ProjectList'; // Renamed Sidebar to ProjectList
import FarmerDetails from './components/FarmerDetails';
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";
import CreateProject from './projects/CreateProject';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected Routes with Constant Header/Footer */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<ProjectList />} />
          <Route path="/projects/:_id" element={<FarmerDetails />} />
          <Route path="/projects/create" element={<CreateProject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;