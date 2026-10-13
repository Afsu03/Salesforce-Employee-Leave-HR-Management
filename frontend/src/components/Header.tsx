import React from 'react'

export default function Header(){
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold">SE</div>
          <h1 className="text-lg font-semibold">Salesforce Employee Leave</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm px-3 py-1 rounded bg-slate-100 dark:bg-slate-700">Profile</button>
        </div>
      </div>
    </header>
  )
}
