import cropsData from '@/services/mockData/crops.json'

class CropService {
  constructor() {
    this.crops = [...cropsData]
  }

  async getAll() {
    await this.delay()
    return [...this.crops]
  }

  async getById(id) {
    await this.delay()
    const crop = this.crops.find(crop => crop.Id === parseInt(id))
    if (!crop) throw new Error('Crop not found')
    return { ...crop }
  }

  async create(cropData) {
    await this.delay()
    const newId = Math.max(...this.crops.map(c => c.Id), 0) + 1
    const crop = {
      Id: newId,
      ...cropData,
      farmId: parseInt(cropData.farmId),
      plantingDate: new Date(cropData.plantingDate).toISOString(),
      expectedHarvest: new Date(cropData.expectedHarvest).toISOString(),
      createdAt: new Date().toISOString()
    }
    this.crops.push(crop)
    return { ...crop }
  }

  async update(id, cropData) {
    await this.delay()
    const index = this.crops.findIndex(crop => crop.Id === parseInt(id))
    if (index === -1) throw new Error('Crop not found')
    
    this.crops[index] = {
      ...this.crops[index],
      ...cropData,
      Id: parseInt(id),
      farmId: parseInt(cropData.farmId)
    }
    return { ...this.crops[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.crops.findIndex(crop => crop.Id === parseInt(id))
    if (index === -1) throw new Error('Crop not found')
    
    this.crops.splice(index, 1)
    return true
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 250))
  }
}

export default new CropService()