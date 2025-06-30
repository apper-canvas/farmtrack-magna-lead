import React from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const TransactionList = ({ transactions, farms, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId)
    return farm ? farm.name : 'All Farms'
  }

  const getTransactionIcon = (type, category) => {
    if (type === 'income') return 'TrendingUp'
    
    switch (category?.toLowerCase()) {
      case 'seeds': return 'Sprout'
      case 'fertilizer': return 'Zap'
      case 'equipment': return 'Wrench'
      case 'fuel': return 'Fuel'
      case 'labor': return 'Users'
      default: return 'TrendingDown'
    }
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.Id}
          className="card p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-success/10' : 'bg-error/10'
              }`}>
                <ApperIcon 
                  name={getTransactionIcon(transaction.type, transaction.category)} 
                  className={`w-5 h-5 ${
                    transaction.type === 'income' ? 'text-success' : 'text-error'
                  }`} 
                />
              </div>
              
              <div className="ml-4">
                <h4 className="font-medium text-primary-900">
                  {transaction.description || transaction.category}
                </h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-primary-600">
                    {getFarmName(transaction.farmId)}
                  </span>
                  <span className="text-sm text-primary-600">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.type === 'income' ? 'text-success' : 'text-error'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </div>
                <div className="text-xs text-primary-600 capitalize">
                  {transaction.category}
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  onClick={() => onEdit(transaction)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={() => onDelete(transaction.Id)}
                  className="text-error hover:bg-red-50"
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default TransactionList