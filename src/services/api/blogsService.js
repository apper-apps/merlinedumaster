const blogsService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "thumbnail_url_c" } },
          { field: { Name: "allowed_roles_c" } },
          { field: { Name: "published_at_c" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('blog_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching blogs:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "thumbnail_url_c" } },
          { field: { Name: "allowed_roles_c" } },
          { field: { Name: "published_at_c" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await apperClient.getRecordById('blog_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching blog with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async create(blogData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: blogData.Name || blogData.title_c || blogData.title,
            title_c: blogData.title_c || blogData.title,
            content_c: blogData.content_c || blogData.content,
            thumbnail_url_c: blogData.thumbnail_url_c || blogData.thumbnailUrl,
            allowed_roles_c: Array.isArray(blogData.allowed_roles_c) ? blogData.allowed_roles_c.join(',') : (blogData.allowedRoles ? blogData.allowedRoles.join(',') : 'free'),
            published_at_c: blogData.published_at_c || blogData.publishedAt || new Date().toISOString(),
            Tags: blogData.Tags || ""
          }
        ]
      }
      
      const response = await apperClient.createRecord('blog_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create blogs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating blog:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async update(id, blogData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = {
        Id: parseInt(id)
      }
      
      // Only include Updateable fields
      if (blogData.Name !== undefined) updateData.Name = blogData.Name
      if (blogData.title_c !== undefined) updateData.title_c = blogData.title_c
      if (blogData.content_c !== undefined) updateData.content_c = blogData.content_c
      if (blogData.thumbnail_url_c !== undefined) updateData.thumbnail_url_c = blogData.thumbnail_url_c
      if (blogData.allowed_roles_c !== undefined) {
        updateData.allowed_roles_c = Array.isArray(blogData.allowed_roles_c) 
          ? blogData.allowed_roles_c.join(',') 
          : blogData.allowed_roles_c
      }
      if (blogData.published_at_c !== undefined) updateData.published_at_c = blogData.published_at_c
      if (blogData.Tags !== undefined) updateData.Tags = blogData.Tags
      
      // Handle legacy field names
      if (blogData.title !== undefined) updateData.title_c = blogData.title
      if (blogData.content !== undefined) updateData.content_c = blogData.content
      if (blogData.thumbnailUrl !== undefined) updateData.thumbnail_url_c = blogData.thumbnailUrl
      if (blogData.allowedRoles !== undefined) {
        updateData.allowed_roles_c = Array.isArray(blogData.allowedRoles) 
          ? blogData.allowedRoles.join(',') 
          : blogData.allowedRoles
      }
      if (blogData.publishedAt !== undefined) updateData.published_at_c = blogData.publishedAt
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('blog_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update blogs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating blog:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('blog_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete blogs ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting blog:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
}

export default blogsService