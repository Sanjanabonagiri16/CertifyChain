export const calculateCertificateStats = (certificates) => {
  const stats = {
    total: certificates.length,
    active: 0,
    expired: 0,
    revoked: 0,
    issuedToday: 0,
    issuedThisWeek: 0,
    issuedThisMonth: 0
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  certificates.forEach(cert => {
    const issueDate = new Date(cert.issueDate);
    const expiryDate = cert.expiryDate ? new Date(cert.expiryDate) : null;

    // Count by status
    if (!cert.isValid) {
      stats.revoked++;
    } else if (expiryDate && expiryDate < now) {
      stats.expired++;
    } else {
      stats.active++;
    }

    // Count by issue date
    if (issueDate >= today) {
      stats.issuedToday++;
    }
    if (issueDate >= oneWeekAgo) {
      stats.issuedThisWeek++;
    }
    if (issueDate >= oneMonthAgo) {
      stats.issuedThisMonth++;
    }
  });

  return stats;
};

export const calculateCertificateDistribution = (certificates) => {
  const distribution = {};

  certificates.forEach(cert => {
    const courseName = cert.courseName;
    distribution[courseName] = (distribution[courseName] || 0) + 1;
  });

  return Object.entries(distribution)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / certificates.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculateMonthlyTrends = (certificates) => {
  const trends = {};

  certificates.forEach(cert => {
    const date = new Date(cert.issueDate);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!trends[monthYear]) {
      trends[monthYear] = {
        total: 0,
        active: 0,
        expired: 0,
        revoked: 0
      };
    }

    trends[monthYear].total++;
    
    if (!cert.isValid) {
      trends[monthYear].revoked++;
    } else if (cert.expiryDate && new Date(cert.expiryDate) < new Date()) {
      trends[monthYear].expired++;
    } else {
      trends[monthYear].active++;
    }
  });

  return Object.entries(trends)
    .map(([month, data]) => ({
      month,
      ...data
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const prepareChartData = (data, type = 'bar') => {
  switch (type) {
    case 'pie':
      return {
        labels: data.map(item => item.name),
        datasets: [{
          data: data.map(item => item.count),
          backgroundColor: [
            '#2563EB', // blue-primary
            '#14B8A6', // teal-primary
            '#F59E0B', // amber-accent
            '#EF4444', // coral-red
            '#22D3EE', // cyan-accent
            '#4B5563', // slate-gray
            '#64748B', // Additional colors for more items
            '#94A3B8',
            '#CBD5E1',
            '#E2E8F0'
          ]
        }]
      };

    case 'line':
      return {
        labels: data.map(item => item.month),
        datasets: [
          {
            label: 'Total',
            data: data.map(item => item.total),
            borderColor: '#2563EB',
            tension: 0.1
          },
          {
            label: 'Active',
            data: data.map(item => item.active),
            borderColor: '#14B8A6',
            tension: 0.1
          },
          {
            label: 'Expired',
            data: data.map(item => item.expired),
            borderColor: '#F59E0B',
            tension: 0.1
          },
          {
            label: 'Revoked',
            data: data.map(item => item.revoked),
            borderColor: '#EF4444',
            tension: 0.1
          }
        ]
      };

    case 'bar':
    default:
      return {
        labels: data.map(item => item.name || item.month),
        datasets: [{
          data: data.map(item => item.count || item.total),
          backgroundColor: '#2563EB'
        }]
      };
  }
};

export const getChartOptions = (type = 'bar') => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  switch (type) {
    case 'pie':
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            position: 'right'
          }
        }
      };

    case 'line':
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

    case 'bar':
    default:
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
  }
}; 