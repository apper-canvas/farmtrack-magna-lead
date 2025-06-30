import React from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import StatusBadge from '@/components/molecules/StatusBadge'
import Button from '@/components/atoms/Button'

const TaskList = ({ tasks, farms, crops, onToggleComplete, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm ? farm.name : 'Unknown Farm'
  }

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.Id === cropId)
    return crop ? crop.name : 'General Task'
  }

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed'
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    return dueDate < today ? 'overdue' : 'pending'
  }

  const getTaskIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'watering': return 'Droplets'
      case 'fertilizing': return 'Zap'
      case 'harvesting': return 'Scissors'
      case 'planting': return 'Sprout'
      case 'weeding': return 'Trash2'
      default: return 'CheckSquare'
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => {
        const status = getTaskStatus(task)
        
        return (
          <motion.div
            key={task.Id}
            className={`card p-4 ${task.completed ? 'opacity-75' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <button
                  onClick={() => onToggleComplete(task.Id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 transition-colors duration-200 ${
                    task.completed
                      ? 'bg-success border-success text-white'
                      : 'border-primary-300 hover:border-primary-500'
                  }`}
                >
                  {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
                </button>
                
                <div className="flex items-center mr-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.completed ? 'bg-gray-100' : 'bg-primary-100'
                  }`}>
                    <ApperIcon 
                      name={getTaskIcon(task.type)} 
                      className={`w-5 h-5 ${task.completed ? 'text-gray-500' : 'text-primary-600'}`} 
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-primary-900'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-primary-600">
                      {getFarmName(task.farmId)} • {getCropName(task.cropId)}
                    </span>
                    <span className="text-sm text-primary-600">
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <StatusBadge status={status} type="task" />
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => onEdit(task)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onDelete(task.Id)}
                    className="text-error hover:bg-red-50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default TaskList