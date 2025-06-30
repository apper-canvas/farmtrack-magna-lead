import React from 'react'

const Select = React.forwardRef(({ 
  label, 
  error, 
  children, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`input-field ${error ? 'border-error focus:ring-error' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select