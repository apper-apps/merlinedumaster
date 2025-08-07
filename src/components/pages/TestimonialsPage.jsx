import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Textarea from "@/components/atoms/Textarea"
import TestimonialCard from "@/components/molecules/TestimonialCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import testimonialsService from "@/services/api/testimonialsService"

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newTestimonialContent, setNewTestimonialContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [editContent, setEditContent] = useState("")

  // Mock user role - in real app, this would come from authentication
  const userRole = "admin" // Could be: "free", "member", "master", "both", "admin"
  const isAdmin = userRole === "admin"

  const loadTestimonials = async () => {
    try {
      setError("")
      setLoading(true)
      
      const data = await testimonialsService.getAll()
      
      // Filter out hidden testimonials for non-admin users
      const visibleTestimonials = isAdmin ? data : data.filter(t => !t.isHidden)
      
      // Sort: pinned first, then by creation date
      const sortedTestimonials = visibleTestimonials.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      
      setTestimonials(sortedTestimonials)
    } catch (err) {
      setError("후기를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTestimonialContent.trim() || newTestimonialContent.length > 500) return

    setSubmitting(true)
    try {
      await testimonialsService.create({
        content: newTestimonialContent,
        userId: "current-user", // In real app, this would be the current user ID
        isPinned: false,
        isHidden: false
      })
      
      setNewTestimonialContent("")
      toast.success("후기가 등록되었습니다")
      loadTestimonials()
    } catch (error) {
      toast.error("후기 등록에 실패했습니다")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial)
    setEditContent(testimonial.content)
  }

  const handleEditSubmit = async () => {
    if (!editContent.trim() || editContent.length > 500) return

    try {
      await testimonialsService.update(editingTestimonial.Id, {
        content: editContent
      })
      
      setEditingTestimonial(null)
      setEditContent("")
      toast.success("후기가 수정되었습니다")
      loadTestimonials()
    } catch (error) {
      toast.error("후기 수정에 실패했습니다")
    }
  }

  const handlePin = async (testimonialId) => {
    try {
      const testimonial = testimonials.find(t => t.Id === testimonialId)
      await testimonialsService.update(testimonialId, {
        isPinned: !testimonial.isPinned
      })
      
      toast.success(testimonial.isPinned ? "고정이 해제되었습니다" : "상단에 고정되었습니다")
      loadTestimonials()
    } catch (error) {
      toast.error("처리에 실패했습니다")
    }
  }

  const handleHide = async (testimonialId) => {
    if (!window.confirm("이 후기를 숨기시겠습니까?")) return

    try {
      await testimonialsService.update(testimonialId, {
        isHidden: true
      })
      
      toast.success("후기가 숨겨졌습니다")
      loadTestimonials()
    } catch (error) {
      toast.error("처리에 실패했습니다")
    }
  }

  const handleDelete = async (testimonialId) => {
    if (!window.confirm("이 후기를 삭제하시겠습니까?")) return

    try {
      await testimonialsService.delete(testimonialId)
      toast.success("후기가 삭제되었습니다")
      loadTestimonials()
    } catch (error) {
      toast.error("삭제에 실패했습니다")
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadTestimonials} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          도전 후기
        </h1>
        <p className="text-gray-600 text-lg">
          함께 성장하는 학습자들의 생생한 도전 이야기를 나눠보세요
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="MessageSquare" className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-primary-600 font-medium">전체 후기</p>
          <p className="text-2xl font-bold text-primary-700">{testimonials.length}개</p>
        </div>
        
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Award" className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-accent-600 font-medium">우수 후기</p>
          <p className="text-2xl font-bold text-accent-700">
            {testimonials.filter(t => t.isPinned).length}개
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Users" className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-secondary-600 font-medium">참여 중</p>
          <p className="text-2xl font-bold text-secondary-700">학습자들</p>
        </div>
      </motion.div>

      {/* Create Testimonial Form */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="User" className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="도전 후기를 공유해주세요... (최대 500자)"
                value={newTestimonialContent}
                onChange={(e) => setNewTestimonialContent(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  newTestimonialContent.length > 500 ? "text-red-500" : "text-gray-500"
                }`}>
                  {newTestimonialContent.length}/500자
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  disabled={!newTestimonialContent.trim() || newTestimonialContent.length > 500}
                  icon="Send"
                >
                  후기 등록
                </Button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Edit Modal */}
      {editingTestimonial && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">후기 수정</h3>
                <button
                  onClick={() => setEditingTestimonial(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="후기를 수정해주세요..."
                rows={6}
                className="mb-4"
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  editContent.length > 500 ? "text-red-500" : "text-gray-500"
                }`}>
                  {editContent.length}/500자
                </span>
                <div className="space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTestimonial(null)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleEditSubmit}
                    disabled={!editContent.trim() || editContent.length > 500}
                  >
                    수정하기
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Testimonials List */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.Id}
              testimonial={testimonial}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPin={handlePin}
              onHide={handleHide}
              canModerate={isAdmin}
              canEdit={true} // In real app, check if user owns this testimonial
            />
          ))
        ) : (
          <Empty
            title="아직 도전 후기가 없습니다"
            description="첫 번째 도전 후기를 작성해보세요"
            icon="MessageSquare"
          />
        )}
      </motion.div>
    </div>
  )
}

export default TestimonialsPage