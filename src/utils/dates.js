export const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  return formatDate(date);
};

export const getDateRangeLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  if (typeof startDate === 'string') {
    startDate = new Date(startDate);
  }
  
  if (typeof endDate === 'string') {
    endDate = new Date(endDate);
  }
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '';
  }
  
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  
  if (sameYear && sameMonth) {
    return `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  }
  
  if (sameYear) {
    return `${startDate.toLocaleDateString('en-US', { month: 'long' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  }
  
  return `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
};

export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (typeof startDate === 'string') {
    startDate = new Date(startDate);
  }
  
  if (typeof endDate === 'string') {
    endDate = new Date(endDate);
  }
  
  if (isNaN(date.getTime()) || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false;
  }
  
  return date >= startDate && date <= endDate;
};

export const getDateRangeOptions = () => [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'week' },
  { label: 'Last 30 days', value: 'month' },
  { label: 'Last 90 days', value: 'quarter' },
  { label: 'Last 365 days', value: 'year' },
  { label: 'All time', value: 'all' }
];

export const getDateFromRange = (range) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (range) {
    case 'today':
      return today;
    case 'week':
      return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    case 'quarter':
      return new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    case 'year':
      return new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    case 'all':
    default:
      return null;
  }
}; 