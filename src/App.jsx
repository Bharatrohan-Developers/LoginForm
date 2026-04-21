import { BrowserRouter, Routes, Route } from 'react-router';
import LoginForm from './components/LoginForm';
import ProjectList from './components/ProjectList'; // Renamed Sidebar to ProjectList
import FarmerDetails from './components/FarmerDetails';
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected Routes with Constant Header/Footer */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/sidebar" element={<ProjectList />} />
          <Route path="/farmers/:_id" element={<FarmerDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;