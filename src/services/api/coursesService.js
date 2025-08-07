import mockCourses from "@/services/mockData/courses.json"

const courses = [...mockCourses]

const coursesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...courses]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const course = courses.find(c => c.Id === parseInt(id))
    if (!course) {
      throw new Error("Course not found")
    }
    return { ...course }
  },

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const maxId = Math.max(...courses.map(c => c.Id), 0)
    const newCourse = {
      ...courseData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      curriculum: courseData.curriculum.map((video, index) => ({
        ...video,
        Id: Math.max(...courses.flatMap(c => c.curriculum?.map(v => v.Id) || []), 0) + index + 1,
        order: index + 1,
        duration: Math.floor(Math.random() * 1800) + 300 // Random duration between 5-35 minutes
      }))
    }
    
    courses.push(newCourse)
    return { ...newCourse }
  },

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    
    courses[index] = {
      ...courses[index],
      ...courseData,
      updatedAt: new Date().toISOString(),
      curriculum: courseData.curriculum?.map((video, videoIndex) => ({
        ...video,
        Id: video.Id || Math.max(...courses.flatMap(c => c.curriculum?.map(v => v.Id) || []), 0) + videoIndex + 1,
        order: videoIndex + 1,
        duration: video.duration || Math.floor(Math.random() * 1800) + 300
      })) || courses[index].curriculum
    }
    
    return { ...courses[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Course not found")
    }
    
    const deleted = courses.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default coursesService