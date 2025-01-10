import { validateEthereumAddress } from './blockchain';

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

export const validateEthAddress = (address) => {
  if (!address) return 'Ethereum address is required';
  
  if (!validateEthereumAddress(address)) {
    return 'Please enter a valid Ethereum address';
  }
  
  return '';
};

export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return `${fieldName} is required`;
  
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  
  return '';
};

export const validateExpiryDate = (expiryDate, issueDate) => {
  if (!expiryDate) return ''; // Expiry date is optional
  
  const selectedExpiryDate = new Date(expiryDate);
  if (isNaN(selectedExpiryDate.getTime())) {
    return 'Please enter a valid expiry date';
  }
  
  if (issueDate) {
    const selectedIssueDate = new Date(issueDate);
    if (selectedExpiryDate <= selectedIssueDate) {
      return 'Expiry date must be after the issue date';
    }
  }
  
  return '';
};

export const validateCertificateForm = (values) => {
  const errors = {};
  
  if (!values.recipientName) {
    errors.recipientName = 'Recipient name is required';
  }

  if (!values.recipientEmail) {
    errors.recipientEmail = 'Recipient email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.recipientEmail)) {
    errors.recipientEmail = 'Invalid email address';
  }

  if (!values.courseName) {
    errors.courseName = 'Course name is required';
  }

  if (!values.issueDate) {
    errors.issueDate = 'Issue date is required';
  }

  if (values.expiryDate && new Date(values.expiryDate) <= new Date(values.issueDate)) {
    errors.expiryDate = 'Expiry date must be after issue date';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  }

  return errors;
};

export const validateVerificationForm = (values) => {
  const errors = {};
  
  if (!values.certificateId && !values.certificateHash) {
    errors.certificateId = 'Please enter a certificate ID or hash';
  }

  return errors;
};

export const validateFileType = (file, allowedTypes) => {
  if (!file) return 'Please select a file';
  
  const fileType = file.type.toLowerCase();
  if (!allowedTypes.includes(fileType)) {
    return `File type not supported. Please upload ${allowedTypes.join(' or ')}`;
  }
  
  return '';
};

export const validateFileSize = (file, maxSizeInMB) => {
  if (!file) return 'Please select a file';
  
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > maxSizeInMB) {
    return `File size should not exceed ${maxSizeInMB}MB`;
  }
  
  return '';
}; 