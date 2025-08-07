import curriculumService from './curriculumService'

const coursesService = {
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
          { field: { Name: "description_c" } },
          { field: { Name: "thumbnail_url_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "allowed_roles_c" } },
          { field: { Name: "is_pinned_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('course_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      // Get curriculum for each course
      const coursesWithCurriculum = await Promise.all(
        (response.data || []).map(async (course) => {
          try {
            const curriculum = await curriculumService.getByCourseId(course.Id)
            return { ...course, curriculum }
          } catch (error) {
            console.error(`Error loading curriculum for course ${course.Id}:`, error)
            return { ...course, curriculum: [] }
          }
        })
      )
      
      return coursesWithCurriculum
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message)
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
          { field: { Name: "description_c" } },
          { field: { Name: "thumbnail_url_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "allowed_roles_c" } },
          { field: { Name: "is_pinned_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "Tags" } }
        ]
      }
      
      const response = await apperClient.getRecordById('course_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      // Get curriculum for this course
      try {
        const curriculum = await curriculumService.getByCourseId(parseInt(id))
        return { ...response.data, curriculum }
      } catch (error) {
        console.error(`Error loading curriculum for course ${id}:`, error)
        return { ...response.data, curriculum: [] }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: courseData.Name || courseData.title_c || courseData.title,
            title_c: courseData.title_c || courseData.title,
            description_c: courseData.description_c || courseData.description,
            thumbnail_url_c: courseData.thumbnail_url_c || courseData.thumbnailUrl,
            type_c: courseData.type_c || courseData.type,
            allowed_roles_c: Array.isArray(courseData.allowed_roles_c) ? courseData.allowed_roles_c.join(',') : (courseData.allowedRoles ? courseData.allowedRoles.join(',') : 'free'),
            is_pinned_c: courseData.is_pinned_c || courseData.isPinned || false,
            created_at_c: courseData.created_at_c || new Date().toISOString(),
            Tags: courseData.Tags || ""
          }
        ]
      }
      
      const response = await apperClient.createRecord('course_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create courses ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        }
        
        if (successfulRecords.length > 0) {
          const newCourse = successfulRecords[0].data
          
          // Create curriculum items if provided
          if (courseData.curriculum && courseData.curriculum.length > 0) {
            try {
              const curriculum = await curriculumService.createMultiple(newCourse.Id, courseData.curriculum)
              return { ...newCourse, curriculum }
            } catch (error) {
              console.error(`Error creating curriculum for course ${newCourse.Id}:`, error)
              return { ...newCourse, curriculum: [] }
            }
          }
          
          return { ...newCourse, curriculum: [] }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  },

  async update(id, courseData) {
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
      if (courseData.Name !== undefined) updateData.Name = courseData.Name
      if (courseData.title_c !== undefined) updateData.title_c = courseData.title_c
      if (courseData.description_c !== undefined) updateData.description_c = courseData.description_c
      if (courseData.thumbnail_url_c !== undefined) updateData.thumbnail_url_c = courseData.thumbnail_url_c
      if (courseData.type_c !== undefined) updateData.type_c = courseData.type_c
      if (courseData.allowed_roles_c !== undefined) {
        updateData.allowed_roles_c = Array.isArray(courseData.allowed_roles_c) 
          ? courseData.allowed_roles_c.join(',') 
          : courseData.allowed_roles_c
      }
      if (courseData.is_pinned_c !== undefined) updateData.is_pinned_c = courseData.is_pinned_c
      if (courseData.created_at_c !== undefined) updateData.created_at_c = courseData.created_at_c
      if (courseData.Tags !== undefined) updateData.Tags = courseData.Tags
      
      // Handle legacy field names
      if (courseData.title !== undefined) updateData.title_c = courseData.title
      if (courseData.description !== undefined) updateData.description_c = courseData.description
      if (courseData.thumbnailUrl !== undefined) updateData.thumbnail_url_c = courseData.thumbnailUrl
      if (courseData.type !== undefined) updateData.type_c = courseData.type
      if (courseData.allowedRoles !== undefined) {
        updateData.allowed_roles_c = Array.isArray(courseData.allowedRoles) 
          ? courseData.allowedRoles.join(',') 
          : courseData.allowedRoles
      }
      if (courseData.isPinned !== undefined) updateData.is_pinned_c = courseData.isPinned
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('course_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update courses ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        }
        
        if (successfulRecords.length > 0) {
          const updatedCourse = successfulRecords[0].data
          
          // Update curriculum if provided
          if (courseData.curriculum !== undefined) {
            try {
              const curriculum = await curriculumService.updateForCourse(parseInt(id), courseData.curriculum)
              return { ...updatedCourse, curriculum }
            } catch (error) {
              console.error(`Error updating curriculum for course ${id}:`, error)
              const existingCurriculum = await curriculumService.getByCourseId(parseInt(id))
              return { ...updatedCourse, curriculum: existingCurriculum }
            }
          } else {
            // Get existing curriculum
            try {
              const curriculum = await curriculumService.getByCourseId(parseInt(id))
              return { ...updatedCourse, curriculum }
            } catch (error) {
              return { ...updatedCourse, curriculum: [] }
            }
          }
        }
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message)
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
      
      // First delete all curriculum items for this course
      try {
        await curriculumService.deleteByCourseId(parseInt(id))
      } catch (error) {
        console.error(`Error deleting curriculum for course ${id}:`, error)
      }
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('course_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete courses ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      throw error
    }
  }
}

export default coursesService