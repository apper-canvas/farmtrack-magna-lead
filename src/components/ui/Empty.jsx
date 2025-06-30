import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = "Sprout", 
  title = "Nothing here yet", 
  description = "Get started by adding your first item",
  actionLabel = "Add New",
  onAction 
}) => {
  return (
    <div className="card p-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default Empty