import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ title, value, icon, change, changeType = 'increase', gradient = false }) => {
  const changeColor = changeType === 'increase' ? 'text-success' : 'text-error'
  const changeIcon = changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'
  
  return (
    <motion.div 
      className={`card p-6 ${gradient ? 'bg-gradient-primary text-white' : ''}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${gradient ? 'text-primary-100' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 font-display ${gradient ? 'text-white' : 'text-primary-900'}`}>
            {value}
          </p>
          {change && (
            <div className={`flex items-center mt-2 ${gradient ? 'text-primary-100' : changeColor}`}>
              <ApperIcon name={changeIcon} className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient ? 'bg-white/20' : 'bg-primary-100'}`}>
          <ApperIcon name={icon} className={`w-6 h-6 ${gradient ? 'text-white' : 'text-primary-600'}`} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard