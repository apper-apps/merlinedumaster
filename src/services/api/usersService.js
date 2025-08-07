import mockUsers from "@/services/mockData/users.json"

const users = [...mockUsers]

const usersService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...users]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const user = users.find(u => u.Id === parseInt(id))
    if (!user) {
      throw new Error("User not found")
    }
    return { ...user }
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const maxId = Math.max(...users.map(u => u.Id), 0)
    const newUser = {
      ...userData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      role: userData.role || "free"
    }
    
    users.push(newUser)
    return { ...newUser }
  },

  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = users.findIndex(u => u.Id === parseInt(id))
    if (index === -1) {
      throw new Error("User not found")
    }
    
    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...users[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = users.findIndex(u => u.Id === parseInt(id))
    if (index === -1) {
      throw new Error("User not found")
    }
    
    const deleted = users.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default usersService