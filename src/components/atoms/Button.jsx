import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 hover:scale-102 focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-primary text-white shadow-soft hover:shadow-medium focus:ring-primary-500',
    secondary: 'bg-white text-primary-900 border border-primary-200 shadow-soft hover:bg-primary-50 hover:shadow-medium focus:ring-primary-500',
    accent: 'bg-gradient-accent text-white shadow-soft hover:shadow-medium focus:ring-accent-500',
    ghost: 'text-primary-900 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-error text-white shadow-soft hover:bg-red-700 focus:ring-error'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <ApperIcon name={icon} className="w-4 h-4 mr-2" />}
          {children}
          {icon && iconPosition === 'right' && <ApperIcon name={icon} className="w-4 h-4 ml-2" />}
        </>
      )}
    </button>
  )
}

export default Button