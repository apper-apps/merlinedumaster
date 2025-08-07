import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const AdminSidebar = ({ onClose }) => {
  const location = useLocation()
  
  const navigation = [
    { name: '대시보드', href: '/admin', icon: 'LayoutDashboard' },
    { name: '사용자 관리', href: '/admin/users', icon: 'Users' },
    { name: '콘텐츠 관리', href: '/admin/content', icon: 'FileText' },
    { name: '강의 관리', href: '/admin/courses', icon: 'PlayCircle' },
    { name: '설정', href: '/admin/settings', icon: 'Settings' },
  ]

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white shadow-lg">
      {/* Logo/Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
            <ApperIcon name="Shield" className="w-5 h-5 text-primary-600" />
          </div>
          <span className="ml-2 text-lg font-semibold text-white">관리자 모드</span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-primary-700"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${isActive(item.href)
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <ApperIcon
              name={item.icon}
              className={`
                mr-3 h-5 w-5 transition-colors
                ${isActive(item.href)
                  ? 'text-primary-500'
                  : 'text-gray-500 group-hover:text-gray-700'
                }
              `}
            />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
            <ApperIcon name="User" className="w-4 h-4 text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">관리자</p>
            <p className="text-xs text-gray-500">시스템 관리</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar