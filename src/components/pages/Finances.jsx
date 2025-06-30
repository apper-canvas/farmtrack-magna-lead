import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import TransactionList from "@/components/organisms/TransactionList";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import FilterTabs from "@/components/molecules/FilterTabs";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import transactionService from "@/services/api/transactionService";
import farmService from "@/services/api/farmService";
const Finances = () => {
  const [transactions, setTransactions] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [formData, setFormData] = useState({
    farmId: '',
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  const typeFilterTabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expenses' }
  ]

  const incomeCategories = [
    'crop-sales',
    'livestock-sales',
    'subsidies',
    'equipment-rental',
    'other-income'
  ]

  const expenseCategories = [
    'seeds',
    'fertilizer',
    'pesticides',
    'equipment',
    'fuel',
    'labor',
    'utilities',
    'maintenance',
    'insurance',
    'other-expense'
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ])
      setTransactions(transactionsData)
      setFarms(farmsData)
    } catch (err) {
      setError('Failed to load financial data')
      console.error('Error loading finances:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const transactionData = {
        ...formData,
        farmId: formData.farmId ? parseInt(formData.farmId) : null,
        amount: parseFloat(formData.amount)
      }
      
      if (editingTransaction) {
        const updatedTransaction = await transactionService.update(editingTransaction.Id, transactionData)
        setTransactions(transactions.map(t => t.Id === editingTransaction.Id ? updatedTransaction : t))
        toast.success('Transaction updated successfully!')
      } else {
        const newTransaction = await transactionService.create(transactionData)
        setTransactions([...transactions, newTransaction])
        toast.success('Transaction added successfully!')
      }
      
      resetForm()
    } catch (err) {
      toast.error(editingTransaction ? 'Failed to update transaction' : 'Failed to add transaction')
      console.error('Error saving transaction:', err)
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      farmId: transaction.farmId ? transaction.farmId.toString() : '',
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      date: transaction.date.split('T')[0],
      description: transaction.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    
    try {
      await transactionService.delete(transactionId)
      setTransactions(transactions.filter(t => t.Id !== transactionId))
      toast.success('Transaction deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete transaction')
      console.error('Error deleting transaction:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      farmId: '',
      type: 'expense',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setEditingTransaction(null)
    setShowForm(false)
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && 
      new Date(t.date).getMonth() === currentMonth && 
      new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && 
      new Date(t.date).getMonth() === currentMonth && 
      new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) return <Loading type="card" count={5} />
  if (error) return <Error message={error} onRetry={loadData} />

const getCurrentCategories = () => {
    return formData.type === 'income' ? incomeCategories : expenseCategories
  }

  const [reportsData, setReportsData] = useState({
    monthlyData: [],
    yearlyData: [],
    categoryBreakdown: [],
    loading: false
  })

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">Financial Management</h1>
          <p className="text-primary-600 mt-1">Track your farm income and expenses</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          icon="Plus"
        >
          Add Transaction
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          icon="TrendingUp"
          change={`$${monthlyIncome.toLocaleString()} this month`}
          changeType="increase"
          gradient
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          change={`$${monthlyExpenses.toLocaleString()} this month`}
          changeType="decrease"
        />
        <StatCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          icon="DollarSign"
          change={netProfit > 0 ? "Profitable" : "Loss"}
          changeType={netProfit > 0 ? "increase" : "decrease"}
        />
        <StatCard
          title="Transactions"
          value={transactions.length}
          icon="Receipt"
          change={`${transactions.filter(t => new Date(t.date).getMonth() === currentMonth).length} this month`}
          changeType="increase"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <SearchBar
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 lg:max-w-md"
        />
        
        <FilterTabs
          tabs={typeFilterTabs}
          activeTab={typeFilter}
          onTabChange={setTypeFilter}
        />
      </div>

      {/* Transaction Form Modal */}
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
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
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
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
              
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {getCurrentCategories().map(category => (
                  <option key={category} value={category}>
                    {category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </Select>
              
              <Input
                label="Amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
              
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              
              <Select
                label="Farm (Optional)"
                value={formData.farmId}
                onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
              >
                <option value="">All farms</option>
                {farms.map(farm => (
                  <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                ))}
              </Select>
              
              <Input
                label="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details..."
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
                  {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <Empty
          icon="Receipt"
          title={searchTerm || typeFilter !== 'all' ? "No transactions found" : "No transactions yet"}
          description={
            searchTerm || typeFilter !== 'all' 
              ? "No transactions match your current filters" 
              : "Start tracking your farm's financial activities by recording income and expenses"
          }
          actionLabel="Add First Transaction"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          farms={farms}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Monthly Summary */}
      {transactions.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary-900 font-display mb-4">
            Monthly Summary ({new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success font-display">
                +${monthlyIncome.toLocaleString()}
              </div>
              <div className="text-sm text-primary-600">Monthly Income</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-error font-display">
                -${monthlyExpenses.toLocaleString()}
              </div>
              <div className="text-sm text-primary-600">Monthly Expenses</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold font-display ${
                (monthlyIncome - monthlyExpenses) >= 0 ? 'text-success' : 'text-error'
              }`}>
                ${(monthlyIncome - monthlyExpenses).toLocaleString()}
              </div>
              <div className="text-sm text-primary-600">Monthly Net</div>
            </div>
          </div>
        </div>
</div>
      )}

      {/* Financial Reports Section */}
      {transactions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-900 font-display">Financial Reports</h2>
            <div className="flex items-center space-x-2">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-primary-600">Data Visualization</span>
            </div>
          </div>

          {/* Chart Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Monthly Income vs Expenses Chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary-900 font-display">
                  Monthly Overview ({new Date().getFullYear()})
                </h3>
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-600" />
              </div>
              
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                    toolbar: { show: false },
                    fontFamily: 'Inter, sans-serif'
                  },
                  colors: ['#10B981', '#EF4444'],
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '60%',
                      borderRadius: 4
                    }
                  },
                  dataLabels: { enabled: false },
                  stroke: { show: false },
                  xaxis: {
                    categories: Array.from({length: 12}, (_, i) => 
                      new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
                    ),
                    labels: {
                      style: { colors: '#6B7280', fontSize: '12px' }
                    }
                  },
                  yaxis: {
                    labels: {
                      style: { colors: '#6B7280', fontSize: '12px' },
                      formatter: (value) => `$${value.toLocaleString()}`
                    }
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    labels: { colors: '#374151' }
                  },
                  grid: {
                    borderColor: '#F3F4F6',
                    strokeDashArray: 3
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toLocaleString()}`
                    }
                  }
                }}
                series={[
                  {
                    name: 'Income',
                    data: Array.from({length: 12}, (_, month) => {
                      return transactions
                        .filter(t => t.type === 'income' && 
                          new Date(t.date).getMonth() === month &&
                          new Date(t.date).getFullYear() === new Date().getFullYear())
                        .reduce((sum, t) => sum + t.amount, 0)
                    })
                  },
                  {
                    name: 'Expenses',
                    data: Array.from({length: 12}, (_, month) => {
                      return transactions
                        .filter(t => t.type === 'expense' && 
                          new Date(t.date).getMonth() === month &&
                          new Date(t.date).getFullYear() === new Date().getFullYear())
                        .reduce((sum, t) => sum + t.amount, 0)
                    })
                  }
                ]}
                type="bar"
                height={300}
              />
            </div>

            {/* Profit/Loss Trend Chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary-900 font-display">
                  Profit/Loss Trend
                </h3>
                <ApperIcon name="LineChart" className="w-5 h-5 text-primary-600" />
              </div>
              
              <Chart
                options={{
                  chart: {
                    type: 'line',
                    toolbar: { show: false },
                    fontFamily: 'Inter, sans-serif'
                  },
                  colors: ['#8B5CF6'],
                  stroke: {
                    curve: 'smooth',
                    width: 3
                  },
                  markers: {
                    size: 5,
                    colors: ['#8B5CF6'],
                    strokeColors: '#fff',
                    strokeWidth: 2
                  },
                  xaxis: {
                    categories: Array.from({length: 12}, (_, i) => 
                      new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
                    ),
                    labels: {
                      style: { colors: '#6B7280', fontSize: '12px' }
                    }
                  },
                  yaxis: {
                    labels: {
                      style: { colors: '#6B7280', fontSize: '12px' },
                      formatter: (value) => `$${value.toLocaleString()}`
                    }
                  },
                  grid: {
                    borderColor: '#F3F4F6',
                    strokeDashArray: 3
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toLocaleString()}`
                    }
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.3,
                      opacityTo: 0.1,
                      stops: [0, 100]
                    }
                  }
                }}
                series={[
                  {
                    name: 'Net Profit',
                    data: Array.from({length: 12}, (_, month) => {
                      const monthlyIncome = transactions
                        .filter(t => t.type === 'income' && 
                          new Date(t.date).getMonth() === month &&
                          new Date(t.date).getFullYear() === new Date().getFullYear())
                        .reduce((sum, t) => sum + t.amount, 0)
                      
                      const monthlyExpenses = transactions
                        .filter(t => t.type === 'expense' && 
                          new Date(t.date).getMonth() === month &&
                          new Date(t.date).getFullYear() === new Date().getFullYear())
                        .reduce((sum, t) => sum + t.amount, 0)
                      
                      return monthlyIncome - monthlyExpenses
                    })
                  }
                ]}
                type="area"
                height={300}
              />
            </div>

            {/* Expense Categories Breakdown */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary-900 font-display">
                  Expense Categories
                </h3>
                <ApperIcon name="PieChart" className="w-5 h-5 text-primary-600" />
              </div>
              
              <Chart
                options={{
                  chart: {
                    type: 'donut',
                    fontFamily: 'Inter, sans-serif'
                  },
                  colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'],
                  labels: [...new Set(transactions.filter(t => t.type === 'expense').map(t => 
                    t.category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                  ))],
                  legend: {
                    position: 'bottom',
                    labels: { colors: '#374151' }
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '70%'
                      }
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(1)}%`
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toLocaleString()}`
                    }
                  }
                }}
                series={(() => {
                  const categoryTotals = {}
                  transactions.filter(t => t.type === 'expense').forEach(t => {
                    const category = t.category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                    categoryTotals[category] = (categoryTotals[category] || 0) + t.amount
                  })
                  return Object.values(categoryTotals)
                })()}
                type="donut"
                height={300}
              />
            </div>

            {/* Income Categories Breakdown */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary-900 font-display">
                  Income Sources
                </h3>
                <ApperIcon name="DollarSign" className="w-5 h-5 text-primary-600" />
              </div>
              
              <Chart
                options={{
                  chart: {
                    type: 'donut',
                    fontFamily: 'Inter, sans-serif'
                  },
                  colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
                  labels: [...new Set(transactions.filter(t => t.type === 'income').map(t => 
                    t.category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                  ))],
                  legend: {
                    position: 'bottom',
                    labels: { colors: '#374151' }
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '70%'
                      }
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(1)}%`
                  },
                  tooltip: {
                    y: {
                      formatter: (value) => `$${value.toLocaleString()}`
                    }
                  }
                }}
                series={(() => {
                  const categoryTotals = {}
                  transactions.filter(t => t.type === 'income').forEach(t => {
                    const category = t.category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                    categoryTotals[category] = (categoryTotals[category] || 0) + t.amount
                  })
                  return Object.values(categoryTotals)
                })()}
                type="donut"
                height={300}
              />
            </div>
          </div>

          {/* Financial Insights */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-primary-900 font-display">
                Financial Insights
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-900 font-display">
                  {((totalIncome / (totalIncome + totalExpenses)) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-primary-600">Income Ratio</div>
              </div>
              
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success font-display">
                  ${(totalIncome / transactions.filter(t => t.type === 'income').length || 0).toLocaleString()}
                </div>
                <div className="text-sm text-primary-600">Avg Income/Transaction</div>
              </div>
              
              <div className="text-center p-4 bg-error/10 rounded-lg">
                <div className="text-2xl font-bold text-error font-display">
                  ${(totalExpenses / transactions.filter(t => t.type === 'expense').length || 0).toLocaleString()}
                </div>
                <div className="text-sm text-primary-600">Avg Expense/Transaction</div>
              </div>
              
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className={`text-2xl font-bold font-display ${
                  netProfit >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()}
                </div>
                <div className="text-sm text-primary-600">Total Profit/Loss</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

export default Finances