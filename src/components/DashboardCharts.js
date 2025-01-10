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
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DashboardCharts({ certificates }) {
  // Get the last 12 months for labels
  const getLastTwelveMonths = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date.toLocaleString('default', { month: 'short' }));
    }
    return months;
  };

  // Calculate monthly certificate counts
  const calculateMonthlyCounts = () => {
    const counts = new Array(12).fill(0);
    const currentDate = new Date();
    
    certificates.forEach(cert => {
      const issueDate = new Date(cert.issueDate);
      const monthDiff = (currentDate.getMonth() - issueDate.getMonth() + 
        (12 * (currentDate.getFullYear() - issueDate.getFullYear())));
      
      if (monthDiff >= 0 && monthDiff < 12) {
        counts[11 - monthDiff]++;
      }
    });
    
    return counts;
  };

  // Calculate certificate types distribution
  const calculateTypeDistribution = () => {
    const typeCounts = certificates.reduce((acc, cert) => {
      acc[cert.certificateType] = (acc[cert.certificateType] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(typeCounts),
      data: Object.values(typeCounts)
    };
  };

  // Calculate status distribution (valid vs expired)
  const calculateStatusDistribution = () => {
    const now = new Date();
    const validCount = certificates.filter(cert => 
      !cert.expiryDate || new Date(cert.expiryDate) > now
    ).length;
    const expiredCount = certificates.length - validCount;

    return {
      valid: validCount,
      expired: expiredCount
    };
  };

  // Line Chart Data - Monthly Certificates
  const lineChartData = {
    labels: getLastTwelveMonths(),
    datasets: [
      {
        label: 'Certificates Issued',
        data: calculateMonthlyCounts(),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Bar Chart Data - Certificate Types
  const typeDistribution = calculateTypeDistribution();
  const barChartData = {
    labels: typeDistribution.labels,
    datasets: [
      {
        label: 'Certificates by Type',
        data: typeDistribution.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  // Pie Chart Data - Status Distribution
  const statusDistribution = calculateStatusDistribution();
  const pieChartData = {
    labels: ['Valid', 'Expired'],
    datasets: [
      {
        data: [statusDistribution.valid, statusDistribution.expired],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Certificate Issuance Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Certificates by Type'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Certificate Status Distribution'
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Line data={lineChartData} options={lineOptions} />
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Bar data={barChartData} options={barOptions} />
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <Pie data={pieChartData} options={pieOptions} />
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Analytics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-600">Total Certificates</span>
            <span className="text-lg font-bold text-blue-600">{certificates.length}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-600">Valid Certificates</span>
            <span className="text-lg font-bold text-green-600">{statusDistribution.valid}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
            <span className="text-sm font-medium text-red-600">Expired Certificates</span>
            <span className="text-lg font-bold text-red-600">{statusDistribution.expired}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium text-yellow-600">Certificate Types</span>
            <span className="text-lg font-bold text-yellow-600">{typeDistribution.labels.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts; 