const curriculumService = {
  async getByCourseId(courseId) {
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
          { field: { Name: "url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "order_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          {
            fieldName: "order_c",
            sorttype: "ASC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('curriculum_item_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error(`Error fetching curriculum for course ${courseId}:`, error)
      return []
    }
  },

  async createMultiple(courseId, curriculumItems) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const records = curriculumItems.map((item, index) => ({
        Name: item.Name || item.title_c || item.title || `Video ${index + 1}`,
        title_c: item.title_c || item.title,
        url_c: item.url_c || item.url,
        duration_c: parseInt(item.duration_c || item.duration || 600),
        order_c: parseInt(item.order_c || item.order || index + 1),
        course_id_c: parseInt(courseId)
      }))
      
      const params = { records }
      
      const response = await apperClient.createRecord('curriculum_item_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords.map(result => result.data)
      }
      
      return []
    } catch (error) {
      console.error(`Error creating curriculum for course ${courseId}:`, error)
      return []
    }
  },

  async updateForCourse(courseId, curriculumItems) {
    try {
      // First delete existing curriculum items
      await this.deleteByCourseId(courseId)
      
      // Then create new ones
      return await this.createMultiple(courseId, curriculumItems)
    } catch (error) {
      console.error(`Error updating curriculum for course ${courseId}:`, error)
      return []
    }
  },

  async deleteByCourseId(courseId) {
    try {
      // First get all curriculum items for this course
      const existingItems = await this.getByCourseId(courseId)
      
      if (existingItems.length === 0) return true
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: existingItems.map(item => item.Id)
      }
      
      const response = await apperClient.deleteRecord('curriculum_item_c', params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      return true
    } catch (error) {
      console.error(`Error deleting curriculum for course ${courseId}:`, error)
      return false
    }
  }
}

export default curriculumService