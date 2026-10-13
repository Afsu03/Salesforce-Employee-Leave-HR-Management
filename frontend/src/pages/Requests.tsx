import React from 'react'

export default function Requests(){
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
      <form className="bg-white dark:bg-slate-800 p-4 rounded shadow space-y-3">
        <label className="block">
          <div className="text-sm mb-1">Type</div>
          <select className="w-full p-2 rounded border dark:border-slate-700">
            <option>Vacation</option>
            <option>Sick</option>
            <option>Work From Home</option>
          </select>
        </label>
        <label className="block">
          <div className="text-sm mb-1">From</div>
          <input type="date" className="w-full p-2 rounded border dark:border-slate-700" />
        </label>
        <label className="block">
          <div className="text-sm mb-1">To</div>
          <input type="date" className="w-full p-2 rounded border dark:border-slate-700" />
        </label>
        <label className="block">
          <div className="text-sm mb-1">Reason</div>
          <textarea className="w-full p-2 rounded border dark:border-slate-700" rows={4}></textarea>
        </label>
        <button className="bg-sky-600 text-white px-4 py-2 rounded">Submit Request</button>
      </form>
    </div>
  )
}
