import transactionsData from '@/services/mockData/transactions.json'

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData]
  }

  async getAll() {
    await this.delay()
    return [...this.transactions]
  }

  async getById(id) {
    await this.delay()
    const transaction = this.transactions.find(transaction => transaction.Id === parseInt(id))
    if (!transaction) throw new Error('Transaction not found')
    return { ...transaction }
  }

  async create(transactionData) {
    await this.delay()
    const newId = Math.max(...this.transactions.map(t => t.Id), 0) + 1
    const transaction = {
      Id: newId,
      ...transactionData,
      farmId: transactionData.farmId ? parseInt(transactionData.farmId) : null,
      amount: parseFloat(transactionData.amount),
      date: new Date(transactionData.date).toISOString(),
      createdAt: new Date().toISOString()
    }
    this.transactions.push(transaction)
    return { ...transaction }
  }

  async update(id, transactionData) {
    await this.delay()
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id))
    if (index === -1) throw new Error('Transaction not found')
    
    this.transactions[index] = {
      ...this.transactions[index],
      ...transactionData,
      Id: parseInt(id),
      farmId: transactionData.farmId ? parseInt(transactionData.farmId) : null,
      amount: parseFloat(transactionData.amount)
    }
    return { ...this.transactions[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.transactions.findIndex(transaction => transaction.Id === parseInt(id))
    if (index === -1) throw new Error('Transaction not found')
    
    this.transactions.splice(index, 1)
    return true
  }

delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }

  async getMonthlyData(year = new Date().getFullYear()) {
    await this.delay()
    const yearTransactions = this.transactions.filter(t => 
      new Date(t.date).getFullYear() === year
    )
    
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = index
      const monthTransactions = yearTransactions.filter(t => 
        new Date(t.date).getMonth() === month
      )
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        month: new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses,
        profit: income - expenses
      }
    })
    
    return monthlyData
  }

  async getYearlyData() {
    await this.delay()
    const yearlyData = {}
    
    this.transactions.forEach(transaction => {
      const year = new Date(transaction.date).getFullYear()
      if (!yearlyData[year]) {
        yearlyData[year] = { income: 0, expenses: 0 }
      }
      
      if (transaction.type === 'income') {
        yearlyData[year].income += transaction.amount
      } else {
        yearlyData[year].expenses += transaction.amount
      }
    })
    
    return Object.entries(yearlyData)
      .map(([year, data]) => ({
        year: parseInt(year),
        income: data.income,
        expenses: data.expenses,
        profit: data.income - data.expenses
      }))
      .sort((a, b) => a.year - b.year)
  }

  async getCategoryBreakdown(type = 'expense', period = 'all') {
    await this.delay()
    let filteredTransactions = this.transactions.filter(t => t.type === type)
    
    if (period === 'currentMonth') {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear
      })
    } else if (period === 'currentYear') {
      const currentYear = new Date().getFullYear()
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.date).getFullYear() === currentYear
      )
    }
    
    const categoryTotals = {}
    filteredTransactions.forEach(transaction => {
      const category = transaction.category
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount
    })
    
    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.amount - a.amount)
  }
}

export default new TransactionService()