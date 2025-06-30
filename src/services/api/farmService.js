import farmsData from '@/services/mockData/farms.json'

class FarmService {
  constructor() {
    this.farms = [...farmsData]
  }

  async getAll() {
    await this.delay()
    return [...this.farms]
  }

  async getById(id) {
    await this.delay()
    const farm = this.farms.find(farm => farm.Id === parseInt(id))
    if (!farm) throw new Error('Farm not found')
    return { ...farm }
  }

  async create(farmData) {
    await this.delay()
    const newId = Math.max(...this.farms.map(f => f.Id), 0) + 1
    const farm = {
      Id: newId,
      ...farmData,
      size: parseFloat(farmData.size),
      createdAt: new Date().toISOString(),
      activeCrops: 0
    }
    this.farms.push(farm)
    return { ...farm }
  }

  async update(id, farmData) {
    await this.delay()
    const index = this.farms.findIndex(farm => farm.Id === parseInt(id))
    if (index === -1) throw new Error('Farm not found')
    
    this.farms[index] = {
      ...this.farms[index],
      ...farmData,
      size: parseFloat(farmData.size),
      Id: parseInt(id)
    }
    return { ...this.farms[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.farms.findIndex(farm => farm.Id === parseInt(id))
    if (index === -1) throw new Error('Farm not found')
    
    this.farms.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new FarmService()