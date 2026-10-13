import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import AnalyticsChart from '../components/AnalyticsChart'
import { getEmployees, getLeaveRequests } from '../api/salesforce'

export default function Dashboard(){
  const [employeesCount, setEmployeesCount] = useState<number | null>(null)
  const [pending, setPending] = useState<number | null>(null)
  const [approvedThisMonth, setApprovedThisMonth] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [emps, reqs] = await Promise.allSettled([getEmployees(), getLeaveRequests()])
        if (!mounted) return

        if (emps.status === 'fulfilled') setEmployeesCount((emps.value && emps.value.length) || 0)
        if (reqs.status === 'fulfilled') {
          const all = reqs.value || []
          setPending(all.filter((r:any)=> r.Status__c === 'Pending').length)
          // naive approved this month count
          const now = new Date()
          const month = now.getMonth()
          const year = now.getFullYear()
          const approved = all.filter((r:any)=> r.Status__c === 'Approved' && new Date(r.CreatedDate || r.createdDate || now).getMonth() === month && new Date(r.CreatedDate || r.createdDate || now).getFullYear() === year)
          setApprovedThisMonth(approved.length)
        }
      } catch (err) {
        // ignore: likely not configured yet
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card title="Total Employees">
          <div className="text-2xl font-bold">{employeesCount ?? 128}</div>
        </Card>
        <Card title="Pending Requests">
          <div className="text-2xl font-bold text-amber-600">{pending ?? 6}</div>
        </Card>
        <Card title="Approved This Month">
          <div className="text-2xl font-bold text-emerald-600">{approvedThisMonth ?? 42}</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Approved Leaves (last 4 weeks)">
          <div className="h-56">
            <AnalyticsChart />
          </div>
        </Card>

        <Card title="Recent Requests">
          <ul className="space-y-2">
            <li className="flex justify-between"><span>Alice Johnson</span><span className="text-sm text-slate-500">2 days ago</span></li>
            <li className="flex justify-between"><span>Bob Smith</span><span className="text-sm text-slate-500">4 days ago</span></li>
            <li className="flex justify-between"><span>Claire Doe</span><span className="text-sm text-slate-500">5 days ago</span></li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
