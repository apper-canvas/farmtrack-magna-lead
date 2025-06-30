import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ placeholder = "Search...", value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="input-field pl-10"
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchBar