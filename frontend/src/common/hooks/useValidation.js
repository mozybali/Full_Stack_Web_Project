import { useCallback } from 'react';

export function useValidation() {
  const validateEmail = useCallback((email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }, []);

  const validatePassword = useCallback((password) => {
    return password.length >= 6;
  }, []);

  const validateUsername = useCallback((username) => {
    return username.length >= 3 && username.length <= 20;
  }, []);

  const validateRequired = useCallback((value) => {
    return value && value.trim().length > 0;
  }, []);

  return {
    validateEmail,
    validatePassword,
    validateUsername,
    validateRequired,
  };
}
