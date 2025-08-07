import { motion } from "framer-motion"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"

const TestimonialCard = ({ testimonial, onEdit, onDelete, onPin, onHide, canModerate = false, canEdit = false }) => {
  const isOwner = canEdit
  const isAdmin = canModerate

  return (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
        testimonial.isPinned ? "border-l-4 border-accent-500" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {testimonial.isPinned && (
        <div className="flex items-center mb-3">
          <Badge variant="accent" size="sm">
            <ApperIcon name="Pin" className="w-3 h-3 mr-1" />
            우수후기
          </Badge>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900">학습자</p>
            <p className="text-sm text-gray-500">
              {format(new Date(testimonial.createdAt), "M월 d일 HH:mm", { locale: ko })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isOwner && (
            <button
              onClick={() => onEdit(testimonial)}
              className="text-gray-400 hover:text-primary-600 transition-colors"
            >
              <ApperIcon name="Edit3" className="w-4 h-4" />
            </button>
          )}
          
          {isAdmin && (
            <>
              <button
                onClick={() => onPin(testimonial.Id)}
                className={`transition-colors ${
                  testimonial.isPinned
                    ? "text-accent-600 hover:text-accent-700"
                    : "text-gray-400 hover:text-accent-600"
                }`}
                title={testimonial.isPinned ? "고정 해제" : "상단 고정"}
              >
                <ApperIcon name="Pin" className="w-4 h-4" />
              </button>
              <button
                onClick={() => onHide(testimonial.Id)}
                className="text-gray-400 hover:text-yellow-600 transition-colors"
                title="숨기기"
              >
                <ApperIcon name="EyeOff" className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(testimonial.Id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="삭제"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      <p className="text-gray-800 leading-relaxed">
        {testimonial.content}
      </p>
    </motion.div>
  )
}

export default TestimonialCard