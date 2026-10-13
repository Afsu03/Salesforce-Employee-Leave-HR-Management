import React from 'react'

export default function Login(){
  return (
    <div className="max-w-md mx-auto mt-12 bg-white dark:bg-slate-800 p-8 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      <form className="flex flex-col gap-3">
        <input className="p-3 rounded border dark:border-slate-700" placeholder="Email" />
        <input type="password" className="p-3 rounded border dark:border-slate-700" placeholder="Password" />
        <button className="mt-2 bg-sky-600 text-white py-2 rounded">Sign in</button>
      </form>
    </div>
  )
}
