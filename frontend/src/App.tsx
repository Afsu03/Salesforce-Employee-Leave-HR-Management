import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Employees from './pages/Employees'
import Requests from './pages/Requests'
import Approvals from './pages/Approvals'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
