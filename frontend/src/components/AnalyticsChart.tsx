import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function AnalyticsChart({data}:{data?:{labels:string[], values:number[]}}){
  const d = data || { labels:['Week 1','Week 2','Week 3','Week 4'], values:[5,8,6,10] }
  const chartData = {
    labels: d.labels,
    datasets: [
      {
        label: 'Approved Leaves',
        data: d.values,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6,182,212,0.16)'
      }
    ]
  }
  const options = { responsive: true, plugins: { legend: { display: false } } }
  return <Line data={chartData} options={options} />
}
