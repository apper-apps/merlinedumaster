import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const BlogCard = ({ post, onEdit, onDelete, canEdit = false }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/blog/${post.Id}`)
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
      <div className="relative cursor-pointer" onClick={handleClick}>
        <img
          src={post.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 
            className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={handleClick}
          >
            {post.title}
          </h3>
          {canEdit && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(post)
                }}
                className="text-gray-400 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="Edit3" className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(post.Id)
                }}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt || post.content?.replace(/<[^>]*>/g, "").substring(0, 150) + "..."}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {post.allowedRoles?.map((role) => (
              <Badge 
                key={role} 
                variant={getRoleBadgeVariant(role)}
                size="sm"
              >
                {role}
              </Badge>
            ))}
          </div>
          
<div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
            {post.publishedAt && !isNaN(new Date(post.publishedAt)) 
              ? format(new Date(post.publishedAt), "M월 d일", { locale: ko })
              : "날짜 없음"
            }
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BlogCard