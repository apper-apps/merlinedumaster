import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const CourseCard = ({ course, onEdit, canEdit = false }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (course.curriculum && course.curriculum.length > 0) {
      navigate(`/video/${course.Id}/${course.curriculum[0].Id}`)
    }
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "free": return "default"
      case "member": return "primary"
      case "master": return "secondary" 
      case "both": return "accent"
      case "admin": return "error"
      default: return "default"
    }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
{course.is_pinned_c && (
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 text-xs font-medium">
          <ApperIcon name="Pin" className="w-3 h-3 inline mr-1" />
          고정 강의
        </div>
      )}
      
      <div className="relative cursor-pointer" onClick={handleClick}>
<img
          src={course.thumbnail_url_c || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
          alt={course.title_c}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ApperIcon name="Play" className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 
            className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={handleClick}
          >
{course.title_c}
          </h3>
          {canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(course)
              }}
              className="text-gray-400 hover:text-primary-600 transition-colors"
            >
              <ApperIcon name="Edit3" className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
{course.description_c}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
{(Array.isArray(course.allowed_roles_c) 
              ? course.allowed_roles_c 
              : course.allowed_roles_c?.split(',') || []
            ).map((role) => (
              <Badge 
                key={role} 
                variant={getRoleBadgeVariant(role.trim())}
                size="sm"
              >
                {role.trim()}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="PlayCircle" className="w-4 h-4 mr-1" />
            {course.curriculum?.length || 0}개 영상
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CourseCard