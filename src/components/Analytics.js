import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  // Mock data - replace with actual data from your blockchain
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const certificatesData = {
    labels: months,
    datasets: [
      {
        label: 'Certificates Issued',
        data: [30, 45, 60, 55, 75, 85],
        borderColor: '#2563EB',
        backgroundColor: '#2563EB20',
        fill: true,
      },
      {
        label: 'Certificates Verified',
        data: [20, 35, 45, 40, 60, 70],
        borderColor: '#14B8A6',
        backgroundColor: '#14B8A620',
        fill: true,
      },
    ],
  };

  const certificateTypesData = {
    labels: ['Course Completion', 'Degree', 'Achievement', 'Participation'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#2563EB', '#14B8A6', '#F59E0B', '#22D3EE'],
      },
    ],
  };

  const verificationStatusData = {
    labels: months,
    datasets: [
      {
        label: 'Successful Verifications',
        data: [65, 75, 85, 80, 90, 95],
        backgroundColor: '#14B8A6',
      },
      {
        label: 'Failed Verifications',
        data: [5, 8, 6, 7, 4, 3],
        backgroundColor: '#EF4444',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-gray">Analytics Dashboard</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-slate-gray mb-2">Total Certificates</h3>
            <p className="text-2xl font-bold">350</p>
            <p className="text-teal-primary text-sm">↑ 12% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-slate-gray mb-2">Active Users</h3>
            <p className="text-2xl font-bold">1,245</p>
            <p className="text-teal-primary text-sm">↑ 8% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-slate-gray mb-2">Verification Rate</h3>
            <p className="text-2xl font-bold">95%</p>
            <p className="text-teal-primary text-sm">↑ 3% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-slate-gray mb-2">Average Response Time</h3>
            <p className="text-2xl font-bold">1.2s</p>
            <p className="text-coral-red text-sm">↓ 0.1s from last month</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-gray mb-4">Certificate Activity</h3>
            <Line data={certificatesData} options={options} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-gray mb-4">Certificate Types Distribution</h3>
            <Pie data={certificateTypesData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-gray mb-4">Verification Status</h3>
          <Bar data={verificationStatusData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Analytics; 