import React from 'react'

const FilterTabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex space-x-1 bg-primary-50 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white text-primary-900 shadow-soft'
              : 'text-primary-700 hover:text-primary-900 hover:bg-primary-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs