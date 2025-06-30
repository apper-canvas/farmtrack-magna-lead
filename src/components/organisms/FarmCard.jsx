import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const FarmCard = ({ farm, onEdit, onDelete }) => {
  return (
    <motion.div 
      className="card p-6"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="MapPin" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-primary-900 font-display">{farm.name}</h3>
              <p className="text-sm text-primary-600">{farm.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Size</p>
              <p className="font-semibold text-primary-900">{farm.size} {farm.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Crops</p>
              <p className="font-semibold text-primary-900">{farm.activeCrops || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon="Edit"
            onClick={() => onEdit(farm)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={() => onDelete(farm.Id)}
            className="text-error hover:bg-red-50"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-100">
        <div className="flex items-center text-sm text-primary-600">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
          <span>Created {new Date(farm.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
          <span className="text-success font-medium">Active</span>
        </div>
      </div>
    </motion.div>
  )
}

export default FarmCard