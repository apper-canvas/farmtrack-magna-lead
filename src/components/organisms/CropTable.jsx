import React from 'react'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import StatusBadge from '@/components/molecules/StatusBadge'
import Button from '@/components/atoms/Button'

const CropTable = ({ crops, farms, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm ? farm.name : 'Unknown Farm'
  }

  const getDaysToHarvest = (expectedHarvest) => {
    const today = new Date()
    const harvestDate = new Date(expectedHarvest)
    const diffTime = harvestDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-primary-100">
        <h3 className="text-lg font-semibold text-primary-900 font-display">Crop Management</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-100">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Crop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Farm & Field
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Planted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Harvest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-primary-100">
            {crops.map((crop) => {
              const daysToHarvest = getDaysToHarvest(crop.expectedHarvest)
              
              return (
                <tr key={crop.Id} className="hover:bg-primary-25 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Sprout" className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-primary-900">{crop.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-900">{getFarmName(crop.farmId)}</div>
                    <div className="text-sm text-primary-600">{crop.field}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900">
                    {format(new Date(crop.plantingDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-900">
                      {format(new Date(crop.expectedHarvest), 'MMM dd, yyyy')}
                    </div>
                    <div className={`text-xs ${daysToHarvest > 7 ? 'text-primary-600' : daysToHarvest > 0 ? 'text-warning' : 'text-error'}`}>
                      {daysToHarvest > 0 ? `${daysToHarvest} days remaining` : 
                       daysToHarvest === 0 ? 'Due today' : 
                       `${Math.abs(daysToHarvest)} days overdue`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={crop.status} type="crop" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEdit(crop)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => onDelete(crop.Id)}
                        className="text-error hover:bg-red-50"
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CropTable