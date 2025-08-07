import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import usersService from "@/services/api/usersService"
import coursesService from "@/services/api/coursesService"
import blogsService from "@/services/api/blogsService"
import testimonialsService from "@/services/api/testimonialsService"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [blogs, setBlogs] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [editingUser, setEditingUser] = useState(null)

  const loadData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [usersData, coursesData, blogsData, testimonialsData] = await Promise.all([
        usersService.getAll(),
        coursesService.getAll(),
        blogsService.getAll(),
        testimonialsService.getAll()
      ])
      
      setUsers(usersData)
      setCourses(coursesData)
      setBlogs(blogsData)
      setTestimonials(testimonialsData)
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersService.update(userId, { role: newRole })
      toast.success("사용자 권한이 변경되었습니다")
      loadData()
    } catch (error) {
      toast.error("권한 변경에 실패했습니다")
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

  const tabs = [
    { id: "overview", name: "개요", icon: "BarChart3" },
    { id: "users", name: "회원 관리", icon: "Users" },
    { id: "content", name: "콘텐츠 관리", icon: "FileText" }
  ]

  const stats = [
    {
      title: "전체 사용자",
      value: users.length,
      icon: "Users",
      color: "bg-primary-500",
      change: "+12%"
    },
    {
      title: "강의 수",
      value: courses.length,
      icon: "PlayCircle",
      color: "bg-secondary-500",
      change: "+8%"
    },
    {
      title: "블로그 포스트",
      value: blogs.length,
      icon: "FileText",
      color: "bg-accent-500",
      change: "+15%"
    },
    {
      title: "도전 후기",
      value: testimonials.length,
      icon: "MessageSquare",
      color: "bg-green-500",
      change: "+23%"
    }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse"></div>
        </div>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          관리자 대시보드
        </h1>
        <p className="text-gray-600">
          플랫폼 전체를 관리하고 모니터링합니다
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                className="bg-white rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className="ml-2 text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">최근 가입자</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("users")}
                >
                  전체보기
                </Button>
              </div>
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.Id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">최근 콘텐츠</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("content")}
                >
                  전체보기
                </Button>
              </div>
              <div className="space-y-4">
                {[...courses, ...blogs].slice(0, 5).map((item) => (
                  <div key={`${item.type || 'blog'}-${item.Id}`} className="flex items-center">
                    <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                      <ApperIcon 
                        name={item.type ? "PlayCircle" : "FileText"} 
                        className="w-4 h-4 text-secondary-600" 
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.type ? "강의" : "블로그"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">회원 목록</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      권한
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가입일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-3 py-1"
                        >
                          <option value="free">free</option>
                          <option value="member">member</option>
                          <option value="master">master</option>
                          <option value="both">both</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                          {user.role}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Tab */}
      {activeTab === "content" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Courses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">강의 관리</h3>
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div key={course.Id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="PlayCircle" className="w-4 h-4 text-secondary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.type} • {course.curriculum?.length || 0}개 영상
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {course.isPinned && (
                        <Badge variant="accent" size="sm">
                          <ApperIcon name="Pin" className="w-3 h-3 mr-1" />
                          고정
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Posts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">블로그 관리</h3>
              <div className="space-y-4">
                {blogs.slice(0, 5).map((blog) => (
                  <div key={blog.Id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {blog.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(blog.publishedAt).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">도전 후기 관리</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.slice(0, 4).map((testimonial) => (
                <div key={testimonial.Id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-3 h-3 text-accent-600" />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">사용자</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {testimonial.isPinned && (
                        <Badge variant="accent" size="sm">
                          우수후기
                        </Badge>
                      )}
                      {testimonial.isHidden && (
                        <Badge variant="error" size="sm">
                          숨김
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 line-clamp-3">
                    {testimonial.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminDashboard