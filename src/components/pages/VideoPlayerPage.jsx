import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import CurriculumSidebar from "@/components/molecules/CurriculumSidebar"
import CourseUploadModal from "@/components/organisms/CourseUploadModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import coursesService from "@/services/api/coursesService"

const VideoPlayerPage = () => {
  const { courseId, videoId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Mock user role - in real app, this would come from authentication
  const userRole = "admin" // Could be: "free", "member", "master", "both", "admin"
  const canEdit = ["admin", "both"].includes(userRole)

  const loadCourse = async () => {
    try {
      setError("")
      setLoading(true)
      
      const courseData = await coursesService.getById(parseInt(courseId))
      setCourse(courseData)
      
      if (courseData.curriculum) {
        const video = courseData.curriculum.find(v => v.Id === parseInt(videoId))
        if (video) {
          setCurrentVideo(video)
        } else if (courseData.curriculum.length > 0) {
          setCurrentVideo(courseData.curriculum[0])
          navigate(`/video/${courseId}/${courseData.curriculum[0].Id}`)
        }
      }
    } catch (err) {
      setError("강의를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId && videoId) {
      loadCourse()
    }
  }, [courseId, videoId])

  const getVideoEmbedUrl = (url) => {
    if (!url) return ""
    
    // YouTube URL conversion
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    
    // Return as-is for other video services
    return url
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    loadCourse() // Refresh course data
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-6">
          <Loading type="video" />
        </div>
        <div className="w-96 bg-gray-50 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadCourse} />
      </div>
    )
  }

  if (!course || !currentVideo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message="강의를 찾을 수 없습니다." onRetry={() => navigate("/")} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-gray-900 truncate mx-4">
              {currentVideo.title}
            </h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
<div className="flex-1 p-6">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Video Container */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
              <div className="aspect-video">
                {getVideoEmbedUrl(currentVideo.url) ? (
                  <iframe
                    src={getVideoEmbedUrl(currentVideo.url)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <ApperIcon name="PlayCircle" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">동영상을 불러올 수 없습니다</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentVideo.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <ApperIcon name="PlayCircle" className="w-4 h-4 mr-1" />
                      강의 {course.curriculum?.findIndex(v => v.Id === currentVideo.Id) + 1}
                      /{course.curriculum?.length}
                    </span>
                    {currentVideo.duration && (
                      <span className="flex items-center">
                        <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                        {Math.floor(currentVideo.duration / 60)}:{(currentVideo.duration % 60).toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
                
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Edit3"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    수정
                  </Button>
                )}
              </div>

              {/* Course Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  강의 소개
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <Button
                variant="outline"
                icon="ArrowLeft"
                onClick={() => navigate(-1)}
              >
                목록으로 돌아가기
              </Button>

              <div className="flex items-center space-x-4">
                {course.curriculum?.map((video, index) => {
                  const isActive = video.Id === currentVideo.Id
                  const isPrev = index === course.curriculum.findIndex(v => v.Id === currentVideo.Id) - 1
                  const isNext = index === course.curriculum.findIndex(v => v.Id === currentVideo.Id) + 1
                  
                  if (isPrev) {
                    return (
                      <Button
                        key={video.Id}
                        variant="ghost"
                        icon="ChevronLeft"
                        onClick={() => navigate(`/video/${courseId}/${video.Id}`)}
                      >
                        이전
                      </Button>
                    )
                  }
                  
                  if (isNext) {
                    return (
                      <Button
                        key={video.Id}
                        variant="primary"
                        icon="ChevronRight"
                        iconPosition="right"
                        onClick={() => navigate(`/video/${courseId}/${video.Id}`)}
                      >
                        다음
                      </Button>
                    )
                  }
                  
                  return null
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Curriculum (shown at bottom on mobile) */}
        <div className="lg:hidden bg-white border-t border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">커리큘럼</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {course.curriculum?.map((video, index) => (
              <button
                key={video.Id}
                onClick={() => navigate(`/video/${courseId}/${video.Id}`)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  ${parseInt(videoId) === video.Id
                    ? "bg-primary-50 border-l-4 border-primary-500"
                    : "bg-gray-50 hover:bg-gray-100"
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3
                    ${parseInt(videoId) === video.Id
                      ? "bg-primary-500 text-white"
                      : "bg-gray-300 text-gray-600"
                    }
                  `}>
                    {index + 1}
                  </div>
                  <span className={`font-medium text-sm ${
                    parseInt(videoId) === video.Id ? "text-primary-700" : "text-gray-900"
                  }`}>
                    {video.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CurriculumSidebar
          course={course}
          isOpen={true}
          onToggle={() => {}}
        />
      </div>

      {/* Mobile Sidebar */}
      <CurriculumSidebar
        course={course}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Edit Modal */}
      <CourseUploadModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        courseType={course.type}
        editingCourse={course}
      />
    </div>
  )
}

export default VideoPlayerPage