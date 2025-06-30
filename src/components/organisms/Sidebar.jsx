import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Farms', href: '/farms', icon: 'MapPin' },
    { name: 'Crops', href: '/crops', icon: 'Sprout' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Finances', href: '/finances', icon: 'DollarSign' },
    { name: 'Weather', href: '/weather', icon: 'Cloud' },
  ]

  return (
    <div className="flex flex-col h-full bg-surface border-r border-primary-100 shadow-soft">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-primary-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Sprout" className="w-6 h-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-primary-900 font-display">FarmTrack</h1>
            <p className="text-sm text-primary-600">Pro</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-2 rounded-md text-primary-400 hover:text-primary-600 hover:bg-primary-50"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href))
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive: linkActive }) => {
                const active = isActive || linkActive
                return `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-gradient-primary text-white shadow-soft'
                    : 'text-primary-700 hover:bg-primary-50 hover:text-primary-900'
                }`
              }}
            >
              {({ isActive: linkActive }) => {
                const active = isActive || linkActive
                return (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={`mr-3 w-5 h-5 ${
                        active ? 'text-white' : 'text-primary-500 group-hover:text-primary-700'
                      }`} 
                    />
                    {item.name}
                    {active && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )
              }}
            </NavLink>
          )
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-primary-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-primary-900">Farm Manager</p>
            <p className="text-xs text-primary-600">Local Account</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar