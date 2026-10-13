import React from 'react'
import Card from '../components/Card'

export default function Dashboard(){
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card title="Total Employees">
          <div className="text-2xl font-bold">128</div>
        </Card>
        <Card title="Pending Requests">
          <div className="text-2xl font-bold text-amber-600">6</div>
        </Card>
        <Card title="Approved This Month">
          <div className="text-2xl font-bold text-emerald-600">42</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Recent Requests">
          <ul className="space-y-2">
            <li className="flex justify-between"><span>Alice Johnson</span><span className="text-sm text-slate-500">2 days ago</span></li>
            <li className="flex justify-between"><span>Bob Smith</span><span className="text-sm text-slate-500">4 days ago</span></li>
            <li className="flex justify-between"><span>Claire Doe</span><span className="text-sm text-slate-500">5 days ago</span></li>
          </ul>
        </Card>

        <Card title="Approvals Queue">
          <p className="text-sm text-slate-500">You have 6 requests waiting for approval.</p>
        </Card>
      </div>
    </div>
  )
}
