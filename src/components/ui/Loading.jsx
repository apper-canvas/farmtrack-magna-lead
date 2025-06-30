import React from 'react'

const Loading = ({ type = 'card', count = 3 }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="h-4 bg-primary-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-primary-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-primary-100 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        {/* Charts and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6">
            <div className="h-6 bg-primary-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-primary-100 rounded"></div>
          </div>
          <div className="card p-6">
            <div className="h-6 bg-primary-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-primary-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-primary-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="card animate-pulse">
        <div className="p-6 border-b border-primary-100">
          <div className="h-6 bg-primary-200 rounded w-1/4"></div>
        </div>
        <div className="divide-y divide-primary-100">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-primary-200 rounded"></div>
                <div className="h-4 bg-primary-100 rounded"></div>
                <div className="h-4 bg-primary-200 rounded"></div>
                <div className="h-4 bg-primary-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-primary-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-primary-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-primary-100 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-20 bg-primary-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading