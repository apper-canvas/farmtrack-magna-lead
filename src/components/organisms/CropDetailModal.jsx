import React from 'react'
import { motion } from 'framer-motion'
import { format, differenceInDays } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import StatusBadge from '@/components/molecules/StatusBadge'
import Button from '@/components/atoms/Button'

const CropDetailModal = ({ crop, farm, onClose }) => {
  const calculateLifecycleProgress = () => {
    const today = new Date()
    const plantingDate = new Date(crop.plantingDate)
    const harvestDate = new Date(crop.expectedHarvest)
    
    const totalDays = differenceInDays(harvestDate, plantingDate)
    const daysPassed = differenceInDays(today, plantingDate)
    const daysRemaining = differenceInDays(harvestDate, today)
    
    // Calculate progress percentage (0-100)
    const progressPercentage = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100)
    
    // Growth stages with their typical percentage ranges
    const stages = [
      { name: 'Planted', range: [0, 15], icon: 'Seed', color: 'bg-gray-400' },
      { name: 'Germination', range: [15, 35], icon: 'Sprout', color: 'bg-yellow-400' },
      { name: 'Growing', range: [35, 75], icon: 'TreePine', color: 'bg-green-400' },
      { name: 'Maturing', range: [75, 95], icon: 'Flower', color: 'bg-blue-400' },
      { name: 'Ready', range: [95, 100], icon: 'Apple', color: 'bg-orange-400' }
    ]
    
    // Determine current stage
    const currentStage = stages.find(stage => 
      progressPercentage >= stage.range[0] && progressPercentage <= stage.range[1]
    ) || stages[stages.length - 1]
    
    return {
      progressPercentage: Math.round(progressPercentage),
      daysPassed,
      daysRemaining,
      totalDays,
      currentStage,
      stages
    }
  }

  const lifecycle = calculateLifecycleProgress()

  const getProgressBarColor = (percentage) => {
    if (percentage < 25) return 'bg-gradient-to-r from-gray-400 to-yellow-400'
    if (percentage < 50) return 'bg-gradient-to-r from-yellow-400 to-green-400'
    if (percentage < 75) return 'bg-gradient-to-r from-green-400 to-blue-400'
    if (percentage < 95) return 'bg-gradient-to-r from-blue-400 to-orange-400'
    return 'bg-gradient-to-r from-orange-400 to-red-400'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'growing': return 'text-green-600'
      case 'ready': return 'text-orange-600'
      case 'harvested': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-hard max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-primary-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sprout" className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary-900 font-display">
                  {crop.name}
                </h2>
                <p className="text-primary-600">{farm?.name || 'Unknown Farm'} • {crop.field}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-primary-400 hover:text-primary-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 font-display">Current Status</h3>
              <p className="text-primary-600">Growth stage and progress</p>
            </div>
            <StatusBadge status={crop.status} type="crop" />
          </div>

          {/* Lifecycle Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-primary-900">Lifecycle Progress</h4>
              <span className="text-sm font-medium text-primary-700">
                {lifecycle.progressPercentage}% Complete
              </span>
            </div>
            
            {/* Main Progress Bar */}
            <div className="relative">
              <div className="w-full bg-primary-100 rounded-full h-6">
                <div
                  className={`h-6 rounded-full transition-all duration-500 ${getProgressBarColor(lifecycle.progressPercentage)}`}
                  style={{ width: `${lifecycle.progressPercentage}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow">
                  {lifecycle.progressPercentage}%
                </span>
              </div>
            </div>

            {/* Current Stage */}
            <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg">
              <div className={`w-10 h-10 ${lifecycle.currentStage.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={lifecycle.currentStage.icon} className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-primary-900">Current Stage: {lifecycle.currentStage.name}</div>
                <div className="text-sm text-primary-600">
                  {lifecycle.daysRemaining > 0 
                    ? `${lifecycle.daysRemaining} days until harvest`
                    : lifecycle.daysRemaining === 0 
                    ? 'Ready for harvest today!'
                    : `${Math.abs(lifecycle.daysRemaining)} days overdue`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Growth Stages Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-900">Growth Stages</h4>
            <div className="space-y-3">
              {lifecycle.stages.map((stage, index) => {
                const isCompleted = lifecycle.progressPercentage >= stage.range[1]
                const isCurrent = lifecycle.currentStage.name === stage.name
                const isUpcoming = lifecycle.progressPercentage < stage.range[0]
                
                return (
                  <div key={stage.name} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted ? stage.color : 
                      isCurrent ? `${stage.color} ring-2 ring-offset-2 ring-blue-400` :
                      'bg-gray-200'
                    }`}>
                      <ApperIcon 
                        name={stage.icon} 
                        className={`w-4 h-4 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}`} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isCurrent ? 'text-primary-900' : 
                        isCompleted ? 'text-primary-700' : 
                        'text-primary-400'
                      }`}>
                        {stage.name}
                      </div>
                      <div className="text-xs text-primary-600">
                        {stage.range[0]}% - {stage.range[1]}%
                      </div>
                    </div>
                    {isCompleted && (
                      <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-900 font-display">
                {lifecycle.daysPassed}
              </div>
              <div className="text-sm text-primary-600">Days Planted</div>
              <div className="text-xs text-primary-500 mt-1">
                Since {format(new Date(crop.plantingDate), 'MMM dd')}
              </div>
            </div>
            
            <div className="card p-4 text-center">
              <div className={`text-2xl font-bold font-display ${
                lifecycle.daysRemaining > 7 ? 'text-primary-900' : 
                lifecycle.daysRemaining > 0 ? 'text-warning' : 
                'text-error'
              }`}>
                {Math.abs(lifecycle.daysRemaining)}
              </div>
              <div className="text-sm text-primary-600">
                {lifecycle.daysRemaining >= 0 ? 'Days Remaining' : 'Days Overdue'}
              </div>
              <div className="text-xs text-primary-500 mt-1">
                Until {format(new Date(crop.expectedHarvest), 'MMM dd')}
              </div>
            </div>
            
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-900 font-display">
                {lifecycle.totalDays}
              </div>
              <div className="text-sm text-primary-600">Total Growth Days</div>
              <div className="text-xs text-primary-500 mt-1">
                Full cycle length
              </div>
            </div>
          </div>

          {/* Planting & Harvest Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary-900">Planting Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-600">Date:</span>
                  <span className="text-primary-900">
                    {format(new Date(crop.plantingDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Location:</span>
                  <span className="text-primary-900">{crop.field}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Farm:</span>
                  <span className="text-primary-900">{farm?.name || 'Unknown'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-primary-900">Harvest Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-600">Expected Date:</span>
                  <span className="text-primary-900">
                    {format(new Date(crop.expectedHarvest), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Status:</span>
                  <span className={getStatusColor(crop.status)}>
                    {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Progress:</span>
                  <span className="text-primary-900">{lifecycle.progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-100">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CropDetailModal