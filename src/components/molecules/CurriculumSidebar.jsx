import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const CurriculumSidebar = ({ course, isOpen, onToggle }) => {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleVideoClick = (video) => {
    navigate(`/video/${course.Id}/${video.Id}`)
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`
          fixed lg:static top-0 right-0 h-full bg-white shadow-xl z-50 lg:z-0
          w-80 lg:w-96 flex flex-col
          transform lg:transform-none
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
        initial={false}
        animate={{
          x: isOpen ? 0 : "100%"
        }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="flex items-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-primary-600 hover:text-primary-700 transition-colors mr-3"
            >
              <ApperIcon 
                name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
                className="w-5 h-5" 
              />
            </button>
            <h3 className="font-semibold text-gray-900">커리큘럼</h3>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Course Info */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="p-6 border-b bg-gray-50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3">
                {course.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {course.curriculum?.map((video, index) => (
              <motion.div
                key={video.Id}
                className={`
                  p-4 rounded-lg mb-3 cursor-pointer transition-all duration-200
                  ${parseInt(videoId) === video.Id
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-500"
                    : "bg-gray-50 hover:bg-gray-100"
                  }
                `}
                onClick={() => handleVideoClick(video)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3
                    ${parseInt(videoId) === video.Id
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-600"
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${
                      parseInt(videoId) === video.Id ? "text-primary-700" : "text-gray-900"
                    }`}>
                      {video.title}
                    </h4>
                    {video.duration && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                      </p>
                    )}
                  </div>
                  {parseInt(videoId) === video.Id && (
                    <ApperIcon name="Play" className="w-4 h-4 text-primary-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default CurriculumSidebar