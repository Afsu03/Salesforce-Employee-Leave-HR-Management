import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header(){
  const [name, setName] = useState('Admin')

  useEffect(() => {
    // placeholder for fetching profile
  }, [])

  return (
    <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-bold">SE</div>
          <div>
            <div className="text-lg font-semibold">SEHRM</div>
            <div className="text-xs opacity-80">Employee Leave & HR Management</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-2">
            <NavLink to="/dashboard" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`} >Dashboard</NavLink>
            <NavLink to="/employees" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>Employees</NavLink>
            <NavLink to="/requests" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>Request</NavLink>
            <NavLink to="/approvals" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}>Approvals</NavLink>
          </nav>

          <ThemeToggle />

          <div className="flex items-center gap-2">
            <button className="bg-white/20 px-3 py-1 rounded">{name}</button>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">A</div>
          </div>
        </div>
      </div>
    </header>
  )
}
