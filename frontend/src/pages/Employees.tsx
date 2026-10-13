import React from 'react'

const mock = [
  {id:1, name:'Alice Johnson', role:'Engineer', email:'alice@example.com'},
  {id:2, name:'Bob Smith', role:'Manager', email:'bob@example.com'},
  {id:3, name:'Claire Doe', role:'Designer', email:'claire@example.com'},
]

export default function Employees(){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Employees</h2>
      <div className="grid grid-cols-3 gap-4">
        {mock.map(e => (
          <div key={e.id} className="bg-white dark:bg-slate-800 p-4 rounded shadow">
            <div className="font-medium">{e.name}</div>
            <div className="text-sm text-slate-500">{e.role}</div>
            <div className="text-sm mt-2">{e.email}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
