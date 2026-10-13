import React from 'react'

const pending = [
  {id:1, name:'Alice Johnson', dates:'2026-10-18 — 2026-10-20', type:'Vacation'},
  {id:2, name:'Bob Smith', dates:'2026-10-21', type:'Sick'},
]

export default function Approvals(){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Approval Queue</h2>
      <div className="space-y-3">
        {pending.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-slate-500">{p.type} — {p.dates}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-emerald-600 text-white">Approve</button>
              <button className="px-3 py-1 rounded bg-rose-600 text-white">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
