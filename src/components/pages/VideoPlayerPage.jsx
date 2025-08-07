import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import coursesService from "@/services/api/coursesService";
import ApperIcon from "@/components/ApperIcon";
import CurriculumSidebar from "@/components/molecules/CurriculumSidebar";
import CourseUploadModal from "@/components/organisms/CourseUploadModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="aspect-video bg-gray-200 rounded-lg animate-pulse mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error message={error} onRetry={loadCourse} />
        </div>
      </div>
    )
  }

  if (!course || !currentVideo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error message="강의를 찾을 수 없습니다." onRetry={() => navigate("/")} />
        </div>
      </div>
    )
  }
  return (
<div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {course.title}
          </h1>
          <p className="text-gray-600">
            {course.description || "전문 강의로 실력을 한 단계 업그레이드하세요"}
          </p>
        </motion.div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white border border-gray-200 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-gray-900 truncate mx-4">
              {currentVideo.title}
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Column - Video & Content (70%) */}
          <div className="lg:col-span-7">
            {/* Video Player */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                {canEdit && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 shadow-lg"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                    수정
                  </button>
                )}
                
                <div className="relative bg-black rounded-xl overflow-hidden">
                  <div className="aspect-video w-full">
                    {currentVideo.youtubeUrl || currentVideo.videoUrl ? (
                      <iframe
                        src={getVideoEmbedUrl(currentVideo.youtubeUrl || currentVideo.videoUrl)}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={currentVideo.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <div className="text-center text-white">
                          <ApperIcon name="Play" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg opacity-75">동영상 준비 중</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course Info */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentVideo.title}</h2>
                {currentVideo.duration && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                    {currentVideo.duration}분
                  </div>
                )}
              </div>
              
              {currentVideo.description && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">강의 소개</h3>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {currentVideo.description}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation Buttons - Desktop Only */}
            <motion.div
              className="hidden lg:flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
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
            </motion.div>
          </div>

          {/* Right Column - Curriculum (30%) */}
          <div className="lg:col-span-3 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CurriculumSidebar
                course={course}
                isOpen={true}
                onToggle={() => {}}
              />
            </motion.div>
          </div>
        </div>

        {/* Mobile Curriculum */}
        <div className="lg:hidden mt-8">
          <CurriculumSidebar
            course={course}
            isOpen={true}
            onToggle={() => {}}
          />
        </div>
      </div>

      {/* Mobile Curriculum Overlay */}
      <CurriculumSidebar
        course={course}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      {/* Course Edit Modal */}
      <CourseUploadModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        courseType={course?.type || "membership"}
        editingCourse={course}
      />
    </div>
  )
}

export default VideoPlayerPage