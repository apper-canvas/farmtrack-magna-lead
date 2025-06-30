import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import CropTable from '@/components/organisms/CropTable'
import CropDetailModal from '@/components/organisms/CropDetailModal'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import SearchBar from '@/components/molecules/SearchBar'
import FilterTabs from '@/components/molecules/FilterTabs'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import cropService from '@/services/api/cropService'
import farmService from '@/services/api/farmService'

const Crops = () => {
  const [crops, setCrops] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingCrop, setEditingCrop] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [formData, setFormData] = useState({
    farmId: '',
    name: '',
    field: '',
    plantingDate: '',
    expectedHarvest: '',
    status: 'growing'
  })

  const statusTabs = [
    { id: 'all', label: 'All Crops' },
    { id: 'growing', label: 'Growing' },
    { id: 'ready', label: 'Ready' },
    { id: 'harvested', label: 'Harvested' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ])
      setCrops(cropsData)
      setFarms(farmsData)
    } catch (err) {
      setError('Failed to load crops data')
      console.error('Error loading crops:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const cropData = {
        ...formData,
        farmId: parseInt(formData.farmId)
      }
      
      if (editingCrop) {
        const updatedCrop = await cropService.update(editingCrop.Id, cropData)
        setCrops(crops.map(crop => crop.Id === editingCrop.Id ? updatedCrop : crop))
        toast.success('Crop updated successfully!')
      } else {
        const newCrop = await cropService.create(cropData)
        setCrops([...crops, newCrop])
        toast.success('Crop added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(editingCrop ? 'Failed to update crop' : 'Failed to add crop')
      console.error('Error saving crop:', err)
    }
  }

  const handleEdit = (crop) => {
    setEditingCrop(crop)
    setFormData({
      farmId: crop.farmId.toString(),
      name: crop.name,
      field: crop.field,
      plantingDate: crop.plantingDate.split('T')[0],
      expectedHarvest: crop.expectedHarvest.split('T')[0],
      status: crop.status
    })
    setShowForm(true)
  }

  const handleDelete = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return
    
    try {
      await cropService.delete(cropId)
      setCrops(crops.filter(crop => crop.Id !== cropId))
      toast.success('Crop deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete crop')
      console.error('Error deleting crop:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      farmId: '',
      name: '',
      field: '',
      plantingDate: '',
      expectedHarvest: '',
      status: 'growing'
    })
    setEditingCrop(null)
    setShowForm(false)
}

  const handleViewDetails = (crop) => {
    setSelectedCrop(crop)
    setShowDetailModal(true)
  }

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.field.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || crop.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return <Loading type="table" count={5} />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">Crop Management</h1>
          <p className="text-primary-600 mt-1">Track your crops from planting to harvest</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon="Plus"
          disabled={farms.length === 0}
        >
          Add New Crop
        </Button>
      </div>

      {farms.length === 0 && (
        <div className="card p-6 border-l-4 border-warning bg-yellow-50">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning mr-3" />
            <div>
              <h4 className="font-semibold text-warning">No Farms Available</h4>
              <p className="text-sm text-yellow-700">
                You need to add at least one farm before you can track crops.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <SearchBar
          placeholder="Search crops..."
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

      {/* Crop Form Modal */}
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
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </h2>
              <button
                onClick={resetForm}
                className="text-primary-400 hover:text-primary-600"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Farm"
                value={formData.farmId}
                onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                required
              >
                <option value="">Select a farm</option>
                {farms.map(farm => (
                  <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                ))}
              </Select>
              
              <Input
                label="Crop Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Corn, Wheat, Tomatoes"
                required
              />
              
              <Input
                label="Field/Plot"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder="e.g., North Field, Plot A"
                required
              />
              
              <Input
                label="Planting Date"
                type="date"
                value={formData.plantingDate}
                onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                required
              />
              
              <Input
                label="Expected Harvest Date"
                type="date"
                value={formData.expectedHarvest}
                onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                required
              />
              
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="growing">Growing</option>
                <option value="ready">Ready for Harvest</option>
                <option value="harvested">Harvested</option>
              </Select>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCrop ? 'Update Crop' : 'Add Crop'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Crops Table */}
      {filteredCrops.length === 0 ? (
        <Empty
          icon="Sprout"
          title={searchTerm || statusFilter !== 'all' ? "No crops found" : "No crops yet"}
          description={
            searchTerm || statusFilter !== 'all' 
              ? "No crops match your current filters" 
              : farms.length === 0 
                ? "Add a farm first, then start tracking your crops"
                : "Start by adding your first crop to track from planting to harvest"
          }
          actionLabel={farms.length === 0 ? null : "Add First Crop"}
          onAction={farms.length === 0 ? null : () => setShowForm(true)}
/>
      ) : (
        <CropTable
          crops={filteredCrops}
          farms={farms}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Crop Detail Modal */}
      {showDetailModal && selectedCrop && (
        <CropDetailModal
          crop={selectedCrop}
          farm={farms.find(f => f.Id === selectedCrop.farmId)}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedCrop(null)
          }}
        />
      )}
      {/* Summary Stats */}
      {crops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-900 font-display">
              {crops.filter(c => c.status === 'growing').length}
            </div>
            <div className="text-primary-600">Growing</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-warning font-display">
              {crops.filter(c => c.status === 'ready').length}
            </div>
            <div className="text-primary-600">Ready to Harvest</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-success font-display">
              {crops.filter(c => c.status === 'harvested').length}
            </div>
            <div className="text-primary-600">Harvested</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-900 font-display">
              {crops.length}
            </div>
            <div className="text-primary-600">Total Crops</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Crops