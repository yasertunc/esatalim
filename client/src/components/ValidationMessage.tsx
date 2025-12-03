import React from 'react';

interface ValidationMessageProps {
  error?: string;
  className?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ 
  error, 
  className = '' 
}) => {
  if (!error) return null;

  return (
    <p className={`text-red-500 text-sm mt-1 ${className}`}>
      {error}
    </p>
  );
};

export default ValidationMessage;
