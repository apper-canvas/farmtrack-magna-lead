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
}

export default new TransactionService()