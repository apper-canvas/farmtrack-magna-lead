import React from 'react'

const StatusBadge = ({ status, type = 'crop' }) => {
  const getStatusConfig = () => {
    if (type === 'crop') {
      switch (status?.toLowerCase()) {
        case 'growing':
          return { color: 'bg-success text-white', label: 'Growing' }
        case 'ready':
          return { color: 'bg-warning text-white', label: 'Ready' }
        case 'harvested':
          return { color: 'bg-gray-500 text-white', label: 'Harvested' }
        default:
          return { color: 'bg-gray-300 text-gray-700', label: status || 'Unknown' }
      }
    }
    
    if (type === 'task') {
      switch (status?.toLowerCase()) {
        case 'pending':
          return { color: 'bg-warning text-white', label: 'Pending' }
        case 'completed':
          return { color: 'bg-success text-white', label: 'Completed' }
        case 'overdue':
          return { color: 'bg-error text-white', label: 'Overdue' }
        default:
          return { color: 'bg-gray-300 text-gray-700', label: status || 'Unknown' }
      }
    }
    
    return { color: 'bg-gray-300 text-gray-700', label: status || 'Unknown' }
  }
  
  const { color, label } = getStatusConfig()
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}

export default StatusBadge