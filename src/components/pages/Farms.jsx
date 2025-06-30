import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import FarmCard from '@/components/organisms/FarmCard'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import farmService from '@/services/api/farmService'

const Farms = () => {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingFarm, setEditingFarm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    unit: 'acres'
  })

  useEffect(() => {
    loadFarms()
  }, [])

  const loadFarms = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await farmService.getAll()
      setFarms(data)
    } catch (err) {
      setError('Failed to load farms')
      console.error('Error loading farms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingFarm) {
        const updatedFarm = await farmService.update(editingFarm.Id, formData)
        setFarms(farms.map(farm => farm.Id === editingFarm.Id ? updatedFarm : farm))
        toast.success('Farm updated successfully!')
      } else {
        const newFarm = await farmService.create(formData)
        setFarms([...farms, newFarm])
        toast.success('Farm added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(editingFarm ? 'Failed to update farm' : 'Failed to add farm')
      console.error('Error saving farm:', err)
    }
  }

  const handleEdit = (farm) => {
    setEditingFarm(farm)
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      unit: farm.unit
    })
    setShowForm(true)
  }

  const handleDelete = async (farmId) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) return
    
    try {
      await farmService.delete(farmId)
      setFarms(farms.filter(farm => farm.Id !== farmId))
      toast.success('Farm deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete farm')
      console.error('Error deleting farm:', err)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', location: '', size: '', unit: 'acres' })
    setEditingFarm(null)
    setShowForm(false)
  }

  const filteredFarms = farms.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loading type="card" count={6} />
  if (error) return <Error message={error} onRetry={loadFarms} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">Farm Management</h1>
          <p className="text-primary-600 mt-1">Manage your farm properties and locations</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon="Plus"
        >
          Add New Farm
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search farms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Farm Form Modal */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-hard max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary-900 font-display">
                {editingFarm ? 'Edit Farm' : 'Add New Farm'}
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
                label="Farm Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Size"
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  required
                />
                
                <Select
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="sq ft">Square Feet</option>
                </Select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFarm ? 'Update Farm' : 'Add Farm'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        <Empty
          icon="MapPin"
          title="No farms found"
          description={searchTerm ? "No farms match your search criteria" : "Start by adding your first farm to begin tracking your agricultural operations"}
          actionLabel="Add First Farm"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm, index) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FarmCard
                farm={farm}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {farms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-900 font-display">
              {farms.length}
            </div>
            <div className="text-primary-600">Total Farms</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-900 font-display">
              {farms.reduce((sum, farm) => sum + parseFloat(farm.size || 0), 0).toLocaleString()}
            </div>
            <div className="text-primary-600">Total Area (acres)</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-900 font-display">
              {new Set(farms.map(farm => farm.location.split(',')[0].trim())).size}
            </div>
            <div className="text-primary-600">Locations</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Farms