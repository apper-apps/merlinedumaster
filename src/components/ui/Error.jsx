import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "문제가 발생했습니다", onRetry, className = "" }) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        오류 발생
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 inline mr-2" />
          다시 시도
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error