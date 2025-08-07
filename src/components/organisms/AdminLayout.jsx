import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from '@/components/pages/AdminDashboard'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={toggleSidebar}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <AdminSidebar onClose={toggleSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">관리자 모드</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/*" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout