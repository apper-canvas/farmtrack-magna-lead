import tasksData from '@/services/mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await this.delay()
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(task => task.Id === parseInt(id))
    if (!task) throw new Error('Task not found')
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    const newId = Math.max(...this.tasks.map(t => t.Id), 0) + 1
    const task = {
      Id: newId,
      ...taskData,
      farmId: parseInt(taskData.farmId),
      cropId: taskData.cropId ? parseInt(taskData.cropId) : null,
      dueDate: new Date(taskData.dueDate).toISOString(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    this.tasks.push(task)
    return { ...task }
  }

  async update(id, taskData) {
    await this.delay()
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error('Task not found')
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id),
      farmId: parseInt(taskData.farmId),
      cropId: taskData.cropId ? parseInt(taskData.cropId) : null
    }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error('Task not found')
    
    this.tasks.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200))
  }
}

export default new TaskService()