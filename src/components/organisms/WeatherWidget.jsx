import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const WeatherWidget = ({ weatherData, loading = false }) => {
  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-primary-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 bg-primary-200 rounded-lg"></div>
          <div className="h-8 bg-primary-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-4 bg-primary-200 rounded mb-2"></div>
              <div className="h-8 w-8 bg-primary-200 rounded-lg mx-auto mb-2"></div>
              <div className="h-3 bg-primary-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': case 'clear': return 'Sun'
      case 'cloudy': case 'overcast': return 'Cloud'
      case 'rainy': case 'rain': return 'CloudRain'
      case 'stormy': case 'thunderstorm': return 'CloudLightning'
      case 'snowy': case 'snow': return 'CloudSnow'
      case 'windy': return 'Wind'
      default: return 'Cloud'
    }
  }

  const current = weatherData?.current || {}
  const forecast = weatherData?.forecast || []

  return (
    <motion.div 
      className="card p-6"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary-900 font-display">Current Weather</h3>
        <div className="text-sm text-primary-600">
          {current.location || 'Farm Location'}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
            <ApperIcon name={getWeatherIcon(current.condition)} className="w-8 h-8 text-white" />
          </div>
          <div className="ml-4">
            <div className="text-3xl font-bold text-primary-900 font-display">
              {current.temperature || 72}°F
            </div>
            <div className="text-primary-600 capitalize">
              {current.condition || 'Partly Cloudy'}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center text-sm text-primary-600 mb-1">
            <ApperIcon name="Droplets" className="w-4 h-4 mr-1" />
            {current.humidity || 65}%
          </div>
          <div className="flex items-center text-sm text-primary-600">
            <ApperIcon name="Wind" className="w-4 h-4 mr-1" />
            {current.windSpeed || 8} mph
          </div>
        </div>
      </div>
      
      <div className="border-t border-primary-100 pt-4">
        <h4 className="text-sm font-semibold text-primary-900 mb-3">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {forecast.slice(0, 5).map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-primary-600 mb-2">
                {day.day || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][index]}
              </div>
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ApperIcon name={getWeatherIcon(day.condition)} className="w-4 h-4 text-primary-600" />
              </div>
              <div className="text-xs font-medium text-primary-900">
                {day.high || [75, 73, 71, 69, 72][index]}°
              </div>
              <div className="text-xs text-primary-500">
                {day.low || [58, 55, 53, 51, 54][index]}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherWidget