import { motion } from "framer-motion"

const Loading = ({ type = "grid", className = "" }) => {
  if (type === "video") {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
        <div className="space-y-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (type === "blog") {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
          <div className="space-y-2">
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Loading