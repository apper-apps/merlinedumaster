const testimonialsService = {
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
          { field: { Name: "user_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "is_pinned_c" } },
          { field: { Name: "is_hidden_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('testimonial_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching testimonials:", error?.response?.data?.message)
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
          { field: { Name: "user_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "is_pinned_c" } },
          { field: { Name: "is_hidden_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await apperClient.getRecordById('testimonial_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching testimonial with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async create(testimonialData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: testimonialData.Name || testimonialData.content_c?.substring(0, 50) || "Testimonial",
            user_id_c: testimonialData.user_id_c || testimonialData.userId || "current-user",
            content_c: testimonialData.content_c || testimonialData.content,
            is_pinned_c: testimonialData.is_pinned_c || testimonialData.isPinned || false,
            is_hidden_c: testimonialData.is_hidden_c || testimonialData.isHidden || false,
            created_at_c: testimonialData.created_at_c || new Date().toISOString(),
            Tags: testimonialData.Tags || ""
          }
        ]
      }
      
      const response = await apperClient.createRecord('testimonial_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create testimonials ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating testimonial:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async update(id, testimonialData) {
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
      if (testimonialData.Name !== undefined) updateData.Name = testimonialData.Name
      if (testimonialData.user_id_c !== undefined) updateData.user_id_c = testimonialData.user_id_c
      if (testimonialData.content_c !== undefined) updateData.content_c = testimonialData.content_c
      if (testimonialData.is_pinned_c !== undefined) updateData.is_pinned_c = testimonialData.is_pinned_c
      if (testimonialData.is_hidden_c !== undefined) updateData.is_hidden_c = testimonialData.is_hidden_c
      if (testimonialData.created_at_c !== undefined) updateData.created_at_c = testimonialData.created_at_c
      if (testimonialData.Tags !== undefined) updateData.Tags = testimonialData.Tags
      
      // Handle legacy field names
      if (testimonialData.content !== undefined) updateData.content_c = testimonialData.content
      if (testimonialData.isPinned !== undefined) updateData.is_pinned_c = testimonialData.isPinned
      if (testimonialData.isHidden !== undefined) updateData.is_hidden_c = testimonialData.isHidden
      if (testimonialData.userId !== undefined) updateData.user_id_c = testimonialData.userId
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('testimonial_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update testimonials ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating testimonial:", error?.response?.data?.message)
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
      
      const response = await apperClient.deleteRecord('testimonial_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete testimonials ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting testimonial:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
}

export default testimonialsService