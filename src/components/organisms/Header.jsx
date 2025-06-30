import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick }) => {
  return (
    <div className="bg-surface shadow-soft border-b border-primary-100 lg:border-b-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="px-4 text-primary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
            
            <div className="flex items-center lg:ml-0">
              <h1 className="text-2xl font-bold text-primary-900 font-display">
                Agriculture Management
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-primary-600">
              <ApperIcon name="MapPin" className="w-4 h-4" />
              <span>Current Location</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Bell" className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header