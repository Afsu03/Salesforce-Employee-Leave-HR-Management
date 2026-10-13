import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/requests', label: 'Request Leave' },
  { to: '/approvals', label: 'Approvals' },
]

export default function Sidebar(){
  return (
    <aside className="w-64 p-6 bg-white dark:bg-slate-800 border-r dark:border-slate-700">
      <nav className="flex flex-col gap-2">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-sky-100 dark:bg-sky-700 font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
