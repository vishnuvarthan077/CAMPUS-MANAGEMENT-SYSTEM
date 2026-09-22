import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Faculty from '../pages/Faculty';
import CoursesPage from '../pages/CoursesPage';
import Attendance from '../pages/Attendance';
import DepartmentsPage from '../pages/DepartmentsPage';
import NoticeboardPage from '../pages/NoticeboardPage';
import PlacementsPage from '../pages/PlacementsPage';
import AlumniPage from '../pages/AlumniPage';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="notices" element={<NoticeboardPage />} />
          <Route path="placements" element={<PlacementsPage />} />
          <Route path="alumni" element={<AlumniPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
