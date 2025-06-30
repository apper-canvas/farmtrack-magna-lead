import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import WeatherWidget from '@/components/organisms/WeatherWidget'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import farmService from '@/services/api/farmService'
import cropService from '@/services/api/cropService'
import taskService from '@/services/api/taskService'
import transactionService from '@/services/api/transactionService'
import weatherService from '@/services/api/weatherService'

const Dashboard = () => {
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [tasks, setTasks] = useState([])
  const [transactions, setTransactions] = useState([])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [farmsData, cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getCurrentWeather()
      ])
      
      setFarms(farmsData)
      setCrops(cropsData)
      setTasks(tasksData)
      setTransactions(transactionsData)
      setWeather(weatherData)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const activeCrops = crops.filter(crop => crop.status === 'growing').length
  const pendingTasks = tasks.filter(task => !task.completed).length
  const overdueTasks = tasks.filter(task => {
    if (task.completed) return false
    return new Date(task.dueDate) < new Date()
  }).length
  
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)
  
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)
  
  const monthlyProfit = monthlyIncome - monthlyExpenses

  const recentActivity = [
    ...crops.slice(0, 3).map(crop => ({
      type: 'crop',
      title: `${crop.name} planted`,
      subtitle: `Field: ${crop.field}`,
      time: new Date(crop.plantingDate).toLocaleDateString(),
      icon: 'Sprout'
    })),
    ...tasks.filter(t => !t.completed).slice(0, 3).map(task => ({
      type: 'task',
      title: task.title,
      subtitle: `Due: ${new Date(task.dueDate).toLocaleDateString()}`,
      time: new Date(task.dueDate).toLocaleDateString(),
      icon: 'CheckSquare'
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">Dashboard</h1>
          <p className="text-primary-600 mt-1">Welcome back! Here's what's happening on your farms.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-primary-600">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farms"
          value={farms.length}
          icon="MapPin"
          change="+2 this month"
          changeType="increase"
        />
        <StatCard
          title="Active Crops"
          value={activeCrops}
          icon="Sprout"
          change={`${crops.length - activeCrops} harvested`}
          changeType="increase"
          gradient
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          change={overdueTasks > 0 ? `${overdueTasks} overdue` : "On schedule"}
          changeType={overdueTasks > 0 ? "decrease" : "increase"}
        />
        <StatCard
          title="Monthly Profit"
          value={`$${monthlyProfit.toLocaleString()}`}
          icon="DollarSign"
          change={monthlyProfit > 0 ? "+12% from last month" : "Below target"}
          changeType={monthlyProfit > 0 ? "increase" : "decrease"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather and Quick Actions */}
        <div className="space-y-6">
          <WeatherWidget weatherData={weather} />
          
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-primary-900 font-display mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 text-left">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Plus" className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-primary-900">Add New Crop</div>
                  <div className="text-sm text-primary-600">Plant a new crop variety</div>
                </div>
              </button>
              
              <button className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 text-left">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="CheckSquare" className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <div className="font-medium text-primary-900">Create Task</div>
                  <div className="text-sm text-primary-600">Schedule farm activity</div>
                </div>
              </button>
              
              <button className="w-full flex items-center p-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 text-left">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="DollarSign" className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="font-medium text-primary-900">Record Transaction</div>
                  <div className="text-sm text-primary-600">Add income or expense</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-primary-900 font-display">Recent Activity</h3>
              <button className="text-sm text-primary-600 hover:text-primary-900 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-center p-4 rounded-lg hover:bg-primary-25 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={activity.icon} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-primary-900">{activity.title}</div>
                    <div className="text-sm text-primary-600">{activity.subtitle}</div>
                  </div>
                  <div className="text-sm text-primary-500">{activity.time}</div>
                </motion.div>
              ))}
              
              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                  <p className="text-primary-600">No recent activity</p>
                  <p className="text-sm text-primary-500">Start by adding farms, crops, or tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {overdueTasks > 0 && (
        <motion.div 
          className="card p-4 border-l-4 border-error bg-red-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-error mr-3" />
            <div>
              <h4 className="font-semibold text-error">Action Required</h4>
              <p className="text-sm text-red-700">
                You have {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''}. 
                Check your task list to stay on schedule.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard