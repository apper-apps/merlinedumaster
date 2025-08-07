import mockBlogs from "@/services/mockData/blogs.json"

const blogs = [...mockBlogs]

const blogsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...blogs]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const blog = blogs.find(b => b.Id === parseInt(id))
    if (!blog) {
      throw new Error("Blog post not found")
    }
    return { ...blog }
  },

  async create(blogData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const maxId = Math.max(...blogs.map(b => b.Id), 0)
    const newBlog = {
      ...blogData,
      Id: maxId + 1,
      publishedAt: blogData.publishedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    blogs.push(newBlog)
    return { ...newBlog }
  },

  async update(id, blogData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = blogs.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Blog post not found")
    }
    
    blogs[index] = {
      ...blogs[index],
      ...blogData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...blogs[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = blogs.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Blog post not found")
    }
    
    const deleted = blogs.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default blogsService