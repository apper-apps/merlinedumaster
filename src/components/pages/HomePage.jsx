import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import CourseCard from "@/components/molecules/CourseCard"
import BlogCard from "@/components/molecules/BlogCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import coursesService from "@/services/api/coursesService"
import blogsService from "@/services/api/blogsService"

const HomePage = () => {
  const [courses, setCourses] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [coursesData, blogsData] = await Promise.all([
        coursesService.getAll(),
        blogsService.getAll()
      ])
      
      setCourses(coursesData.slice(0, 6)) // Show only 6 items on homepage
      setBlogs(blogsData.slice(0, 6)) // Show only 6 items on homepage
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
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
      {/* Hero Section */}
      <motion.section
        className="text-center py-16 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            EduMaster
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            전문가들과 함께하는 프리미엄 온라인 학습 플랫폼<br />
            당신의 성장을 위한 최고의 교육 콘텐츠를 만나보세요
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/membership">
              <Button variant="primary" size="lg" icon="PlayCircle">
                멤버십 강의 보기
              </Button>
            </Link>
            <Link to="/master">
              <Button variant="secondary" size="lg" icon="Award">
                마스터 클래스
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Courses */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              인기 강의
            </h2>
            <p className="text-gray-600">
              가장 많은 학습자들이 선택한 강의들을 만나보세요
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/membership">
              <Button variant="outline" size="sm">
                멤버십 전체보기
              </Button>
            </Link>
            <Link to="/master">
              <Button variant="outline" size="sm">
                마스터 전체보기
              </Button>
            </Link>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.Id} course={course} />
            ))}
          </div>
        ) : (
          <Empty
            title="아직 강의가 없습니다"
            description="첫 번째 강의를 등록해보세요"
            icon="PlayCircle"
          />
        )}
      </motion.section>

      {/* Featured Blog Posts */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              최신 인사이트
            </h2>
            <p className="text-gray-600">
              전문가들의 인사이트와 학습 팁을 확인해보세요
            </p>
          </div>
          <Link to="/insights">
            <Button variant="outline" size="sm">
              전체보기
            </Button>
          </Link>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.Id} post={blog} />
            ))}
          </div>
        ) : (
          <Empty
            title="아직 인사이트가 없습니다"
            description="첫 번째 글을 작성해보세요"
            icon="FileText"
          />
        )}
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl p-12 text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold mb-4">
          지금 시작하세요
        </h2>
        <p className="text-xl mb-8 opacity-90">
          전문가들의 노하우를 배우고 성공 경험을 공유해보세요
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/testimonials">
            <Button variant="accent" size="lg" icon="MessageSquare">
              성공 후기 보기
            </Button>
          </Link>
          <Link to="/insights">
            <Button variant="ghost" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/30" icon="BookOpen">
              학습 자료 탐색
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage