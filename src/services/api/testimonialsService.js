import mockTestimonials from "@/services/mockData/testimonials.json"

const testimonials = [...mockTestimonials]

const testimonialsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...testimonials]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const testimonial = testimonials.find(t => t.Id === parseInt(id))
    if (!testimonial) {
      throw new Error("Testimonial not found")
    }
    return { ...testimonial }
  },

  async create(testimonialData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const maxId = Math.max(...testimonials.map(t => t.Id), 0)
    const newTestimonial = {
      ...testimonialData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      isPinned: false,
      isHidden: false
    }
    
    testimonials.push(newTestimonial)
    return { ...newTestimonial }
  },

  async update(id, testimonialData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = testimonials.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Testimonial not found")
    }
    
    testimonials[index] = {
      ...testimonials[index],
      ...testimonialData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...testimonials[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = testimonials.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Testimonial not found")
    }
    
    const deleted = testimonials.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default testimonialsService