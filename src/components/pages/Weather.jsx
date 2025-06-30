import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WeatherWidget from '@/components/organisms/WeatherWidget'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import weatherService from '@/services/api/weatherService'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [current, forecast] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getExtendedForecast()
      ])
      
      setWeatherData(current)
      setForecastData(forecast)
    } catch (err) {
      setError('Failed to load weather data')
      console.error('Error loading weather:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary-900 font-display">Weather Forecast</h1>
        </div>
        <Loading type="card" count={3} />
      </div>
    )
  }

  if (error) return <Error message={error} onRetry={loadWeatherData} />

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

  const getRecommendation = (condition, temperature) => {
    if (condition?.toLowerCase().includes('rain')) {
      return {
        icon: 'Droplets',
        title: 'Good for watering',
        description: 'Natural irrigation - consider delaying scheduled watering',
        color: 'text-info'
      }
    }
    
    if (temperature > 85) {
      return {
        icon: 'Thermometer',
        title: 'Hot weather alert',
        description: 'Ensure adequate watering and check for heat stress',
        color: 'text-error'
      }
    }
    
    if (temperature < 40) {
      return {
        icon: 'Snowflake',
        title: 'Frost warning',
        description: 'Protect sensitive crops from potential frost damage',
        color: 'text-info'
      }
    }
    
    return {
      icon: 'CheckCircle',
      title: 'Ideal conditions',
      description: 'Good weather for most farming activities',
      color: 'text-success'
    }
  }

  const current = weatherData?.current || {}
  const recommendation = getRecommendation(current.condition, current.temperature)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">Weather Forecast</h1>
          <p className="text-primary-600 mt-1">Stay informed about weather conditions for better farm planning</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-primary-600">
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeatherWidget weatherData={weatherData} />
        </div>
        
        {/* Weather Recommendation */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary-900 font-display mb-4">Farm Recommendations</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                recommendation.color === 'text-success' ? 'bg-success/10' :
                recommendation.color === 'text-error' ? 'bg-error/10' :
                'bg-info/10'
              }`}>
                <ApperIcon name={recommendation.icon} className={`w-5 h-5 ${recommendation.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-primary-900">{recommendation.title}</h4>
                <p className="text-sm text-primary-600 mt-1">{recommendation.description}</p>
              </div>
            </div>
            
            {/* Additional insights */}
            <div className="pt-4 border-t border-primary-100">
              <h5 className="font-medium text-primary-900 mb-2">Quick Insights</h5>
              <div className="space-y-2 text-sm text-primary-600">
                <div className="flex items-center">
                  <ApperIcon name="Droplets" className="w-4 h-4 mr-2" />
                  <span>Humidity: {current.humidity || 65}% - {current.humidity > 70 ? 'High' : current.humidity > 50 ? 'Moderate' : 'Low'}</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Wind" className="w-4 h-4 mr-2" />
                  <span>Wind: {current.windSpeed || 8} mph - {current.windSpeed > 15 ? 'Strong' : 'Calm'}</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                  <span>Visibility: Good for field work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Forecast */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-primary-900 font-display mb-6">10-Day Extended Forecast</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {forecastData.slice(0, 10).map((day, index) => (
            <motion.div
              key={index}
              className="text-center p-4 rounded-lg hover:bg-primary-25 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-sm font-medium text-primary-900 mb-2">
                {day.day || new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-xs text-primary-600 mb-3">
                {new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ApperIcon name={getWeatherIcon(day.condition)} className="w-6 h-6 text-primary-600" />
              </div>
              
              <div className="text-sm font-semibold text-primary-900">
                {day.high || [75, 73, 71, 69, 72, 74, 76, 78, 75, 73][index]}°
              </div>
              <div className="text-xs text-primary-500">
                {day.low || [58, 55, 53, 51, 54, 56, 59, 62, 58, 55][index]}°
              </div>
              
              <div className="text-xs text-primary-600 mt-2 capitalize">
                {day.condition || ['Sunny', 'Cloudy', 'Rain', 'Sunny', 'Partly Cloudy', 'Sunny', 'Cloudy', 'Rain', 'Sunny', 'Cloudy'][index]}
              </div>
              
              {day.precipitation && (
                <div className="text-xs text-info mt-1">
                  {day.precipitation}% rain
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary-900 font-display mb-4">Weather Alerts</h3>
          
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-warning/10 rounded-lg">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning mr-3" />
              <div>
                <div className="font-medium text-warning">High Temperature Alert</div>
                <div className="text-sm text-yellow-700">Temperatures above 85°F expected tomorrow</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-info/10 rounded-lg">
              <ApperIcon name="CloudRain" className="w-5 h-5 text-info mr-3" />
              <div>
                <div className="font-medium text-info">Rain Expected</div>
                <div className="text-sm text-blue-700">30% chance of rain on Thursday</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary-900 font-display mb-4">Best Days for Activities</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Sprout" className="w-5 h-5 text-success mr-3" />
                <span className="font-medium text-success">Planting</span>
              </div>
              <span className="text-sm text-green-700">Today, Tomorrow</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Droplets" className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-medium text-primary-900">Watering</span>
              </div>
              <span className="text-sm text-primary-600">Wednesday, Friday</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
              <div className="flex items-center">
                <ApperIcon name="Scissors" className="w-5 h-5 text-accent-600 mr-3" />
                <span className="font-medium text-accent-900">Harvesting</span>
              </div>
              <span className="text-sm text-orange-700">Saturday, Sunday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather