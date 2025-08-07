import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "콘텐츠가 없습니다", 
  description = "아직 등록된 콘텐츠가 없습니다.", 
  actionText,
  onAction,
  icon = "FileX",
  className = "" 
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {actionText && onAction && (
        <motion.button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty