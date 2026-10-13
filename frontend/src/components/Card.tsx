import React from 'react'

export default function Card({title, children}:{title:string, children:React.ReactNode}){
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  )
}
