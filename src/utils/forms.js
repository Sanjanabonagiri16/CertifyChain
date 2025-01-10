import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name] && validate) {
      const validationErrors = validate({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  }, [values, touched, validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  }, [values, validate]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      // Mark all fields as touched
      const touchedFields = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(touchedFields);
      
      if (Object.keys(validationErrors).length === 0) {
        await onSubmit(values);
      }
    } else {
      await onSubmit(values);
    }
  }, [values, validate]);

  const reset = useCallback((newValues = {}) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name] && validate) {
      const validationErrors = validate({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    }
  }, [values, touched, validate]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setFieldTouched
  };
};

export const createFormData = (values) => {
  const formData = new FormData();
  
  Object.entries(values).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

export const formatFormErrors = (errors) => {
  if (typeof errors === 'string') {
    return errors;
  }
  
  if (Array.isArray(errors)) {
    return errors.join(', ');
  }
  
  if (typeof errors === 'object') {
    return Object.values(errors).join(', ');
  }
  
  return '';
};

export const getFieldProps = (form, name) => ({
  name,
  value: form.values[name] || '',
  onChange: form.handleChange,
  onBlur: form.handleBlur,
  error: form.touched[name] && form.errors[name],
  'aria-invalid': form.touched[name] && !!form.errors[name]
});

export const getInputClassName = (error, touched, baseClass = '') => {
  const defaultClass = 'px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors';
  const errorClass = error && touched ? 'border-coral-red focus:ring-coral-red/20' : 'border-gray-300 focus:ring-blue-primary/20';
  return `${defaultClass} ${errorClass} ${baseClass}`.trim();
}; 