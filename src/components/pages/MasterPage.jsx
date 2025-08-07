import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import CourseCard from "@/components/molecules/CourseCard"
import CourseUploadModal from "@/components/organisms/CourseUploadModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import coursesService from "@/services/api/coursesService"

const MasterPage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)

  // Mock user role - in real app, this would come from authentication
  const userRole = "admin" // Could be: "free", "member", "master", "both", "admin"
  const canUpload = ["admin", "both"].includes(userRole)

  const loadCourses = async () => {
    try {
      setError("")
      setLoading(true)
      
      const data = await coursesService.getAll()
      const masterCourses = data.filter(course => course.type === "master")
      
      // Sort: pinned courses first, then by creation date
      const sortedCourses = masterCourses.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      })
      
      setCourses(sortedCourses)
    } catch (err) {
      setError("강의를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleEdit = (course) => {
    setEditingCourse(course)
    setIsUploadModalOpen(true)
  }

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false)
    setEditingCourse(null)
    loadCourses() // Refresh the list
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse"></div>
        </div>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadCourses} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            마스터 클래스
          </h1>
          <p className="text-gray-600">
            업계 최고 전문가들의 마스터 클래스로 깊은 통찰을 얻어보세요
          </p>
        </div>
        
        {canUpload && (
          <Button
            variant="secondary"
            size="lg"
            icon="Plus"
            onClick={() => setIsUploadModalOpen(true)}
          >
            마스터 클래스 업로드
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Award" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-600 font-medium">마스터 클래스</p>
              <p className="text-2xl font-bold text-secondary-700">{courses.length}개</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Pin" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-accent-600 font-medium">고정 클래스</p>
              <p className="text-2xl font-bold text-accent-700">
                {courses.filter(c => c.isPinned).length}개
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-primary-600 font-medium">수강 가능</p>
              <p className="text-2xl font-bold text-primary-700">마스터+</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.Id}
                course={course}
                onEdit={canUpload ? handleEdit : undefined}
                canEdit={canUpload}
              />
            ))}
          </div>
        ) : (
          <Empty
            title="아직 마스터 클래스가 없습니다"
            description="첫 번째 마스터 클래스를 업로드해보세요"
            actionText={canUpload ? "마스터 클래스 업로드" : undefined}
            onAction={canUpload ? () => setIsUploadModalOpen(true) : undefined}
            icon="Award"
          />
        )}
      </motion.div>

      {/* Upload Modal */}
      <CourseUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        courseType="master"
        editingCourse={editingCourse}
      />
    </div>
  )
}

export default MasterPage