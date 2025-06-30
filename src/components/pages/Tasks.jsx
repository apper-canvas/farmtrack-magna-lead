import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import SearchBar from '@/components/molecules/SearchBar'
import FilterTabs from '@/components/molecules/FilterTabs'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import taskService from '@/services/api/taskService'
import farmService from '@/services/api/farmService'
import cropService from '@/services/api/cropService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    farmId: '',
    cropId: '',
    title: '',
    type: 'watering',
    dueDate: '',
    completed: false
  })

  const statusTabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'overdue', label: 'Overdue' }
  ]

  const taskTypes = [
    'watering',
    'fertilizing',
    'planting',
    'harvesting',
    'weeding',
    'pruning',
    'pest-control',
    'maintenance'
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ])
      setTasks(tasksData)
      setFarms(farmsData)
      setCrops(cropsData)
    } catch (err) {
      setError('Failed to load tasks data')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const taskData = {
        ...formData,
        farmId: parseInt(formData.farmId),
        cropId: formData.cropId ? parseInt(formData.cropId) : null
      }
      
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData)
        setTasks(tasks.map(task => task.Id === editingTask.Id ? updatedTask : task))
        toast.success('Task updated successfully!')
      } else {
        const newTask = await taskService.create(taskData)
        setTasks([...tasks, newTask])
        toast.success('Task added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to add task')
      console.error('Error saving task:', err)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      if (!task) return
      
      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed: !task.completed
      })
      
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t))
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task marked as pending')
    } catch (err) {
      toast.error('Failed to update task status')
      console.error('Error updating task:', err)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      farmId: task.farmId.toString(),
      cropId: task.cropId ? task.cropId.toString() : '',
      title: task.title,
      type: task.type,
      dueDate: task.dueDate.split('T')[0],
      completed: task.completed
    })
    setShowForm(true)
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(taskId)
      setTasks(tasks.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      farmId: '',
      cropId: '',
      title: '',
      type: 'watering',
      dueDate: '',
      completed: false
    })
    setEditingTask(null)
    setShowForm(false)
  }

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed'
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    return dueDate < today ? 'overdue' : 'pending'
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter !== 'all') {
      const taskStatus = getTaskStatus(task)
      matchesStatus = taskStatus === statusFilter
    }
    
    return matchesSearch && matchesStatus
  })

  const farmCrops = crops.filter(crop => 
    formData.farmId ? crop.farmId === parseInt(formData.farmId) : false
  )

  if (loading) return <Loading type="card" count={5} />
  if (error) return <Error message={error} onRetry={loadData} />

  const pendingTasks = tasks.filter(t => !t.completed).length
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">Task Management</h1>
          <p className="text-primary-600 mt-1">Organize and track your farming activities</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon="Plus"
          disabled={farms.length === 0}
        >
          Add New Task
        </Button>
      </div>

      {farms.length === 0 && (
        <div className="card p-6 border-l-4 border-warning bg-yellow-50">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning mr-3" />
            <div>
              <h4 className="font-semibold text-warning">No Farms Available</h4>
              <p className="text-sm text-yellow-700">
                You need to add at least one farm before you can create tasks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alert for overdue tasks */}
      {overdueTasks > 0 && (
        <motion.div 
          className="card p-4 border-l-4 border-error bg-red-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-error mr-3" />
            <div>
              <h4 className="font-semibold text-error">Overdue Tasks</h4>
              <p className="text-sm text-red-700">
                You have {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''} that need immediate attention.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <SearchBar
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 lg:max-w-md"
        />
        
        <FilterTabs
          tabs={statusTabs}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
        />
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-hard max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary-900 font-display">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={resetForm}
                className="text-primary-400 hover:text-primary-600"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Water tomatoes, Apply fertilizer"
                required
              />
              
              <Select
                label="Task Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {taskTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </Select>
              
              <Select
                label="Farm"
                value={formData.farmId}
                onChange={(e) => setFormData({ ...formData, farmId: e.target.value, cropId: '' })}
                required
              >
                <option value="">Select a farm</option>
                {farms.map(farm => (
                  <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                ))}
              </Select>
              
              <Select
                label="Crop (Optional)"
                value={formData.cropId}
                onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              >
                <option value="">General farm task</option>
                {farmCrops.map(crop => (
                  <option key={crop.Id} value={crop.Id}>{crop.name} - {crop.field}</option>
                ))}
              </Select>
              
              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title={searchTerm || statusFilter !== 'all' ? "No tasks found" : "No tasks yet"}
          description={
            searchTerm || statusFilter !== 'all' 
              ? "No tasks match your current filters" 
              : farms.length === 0 
                ? "Add a farm first, then start organizing your farming activities"
                : "Start by adding your first task to organize your farming activities"
          }
          actionLabel={farms.length === 0 ? null : "Add First Task"}
          onAction={farms.length === 0 ? null : () => setShowForm(true)}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          farms={farms}
          crops={crops}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Summary Stats */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-warning font-display">
              {pendingTasks}
            </div>
            <div className="text-primary-600">Pending Tasks</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-error font-display">
              {overdueTasks}
            </div>
            <div className="text-primary-600">Overdue</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-success font-display">
              {tasks.filter(t => t.completed).length}
            </div>
            <div className="text-primary-600">Completed</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-900 font-display">
              {tasks.length}
            </div>
            <div className="text-primary-600">Total Tasks</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks