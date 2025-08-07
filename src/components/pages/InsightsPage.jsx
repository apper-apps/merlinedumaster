import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import BlogCard from "@/components/molecules/BlogCard"
import BlogUploadModal from "@/components/organisms/BlogUploadModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import blogsService from "@/services/api/blogsService"

const InsightsPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  // Mock user role - in real app, this would come from authentication
  const userRole = "admin" // Could be: "free", "member", "master", "both", "admin"
  const canWrite = ["admin", "both"].includes(userRole)

  const loadPosts = async () => {
    try {
      setError("")
      setLoading(true)
      
      const data = await blogsService.getAll()
      
      // Sort by published date
      const sortedPosts = data.sort((a, b) => 
        new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
      )
      
      setPosts(sortedPosts)
    } catch (err) {
      setError("글을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleEdit = (post) => {
    setEditingPost(post)
    setIsUploadModalOpen(true)
  }

  const handleDelete = async (postId) => {
    if (!window.confirm("이 글을 삭제하시겠습니까?")) return

    try {
      await blogsService.delete(postId)
      toast.success("글이 삭제되었습니다")
      loadPosts() // Refresh the list
    } catch (error) {
      toast.error("삭제에 실패했습니다")
    }
  }

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false)
    setEditingPost(null)
    loadPosts() // Refresh the list
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse"></div>
        </div>
        <Loading type="blog" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadPosts} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            인사이트
          </h1>
          <p className="text-gray-600">
            전문가들의 인사이트와 학습 가이드를 통해 새로운 지식을 습득하세요
          </p>
        </div>
        
        {canWrite && (
          <Button
            variant="primary"
            size="lg"
            icon="PenTool"
            onClick={() => setIsUploadModalOpen(true)}
          >
            글 작성
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-primary-600 font-medium">전체 글</p>
              <p className="text-2xl font-bold text-primary-700">{posts.length}개</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-600 font-medium">이번 달</p>
              <p className="text-2xl font-bold text-secondary-700">
                {posts.filter(p => {
                  const publishDate = new Date(p.publishedAt)
                  const now = new Date()
                  return publishDate.getMonth() === now.getMonth() && publishDate.getFullYear() === now.getFullYear()
                }).length}개
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-accent-600 font-medium">카테고리</p>
              <p className="text-2xl font-bold text-accent-700">학습 블로그</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.Id}
                post={post}
                onEdit={canWrite ? handleEdit : undefined}
                onDelete={canWrite ? handleDelete : undefined}
                canEdit={canWrite}
              />
            ))}
          </div>
        ) : (
          <Empty
            title="아직 인사이트가 없습니다"
            description="첫 번째 인사이트 글을 작성해보세요"
            actionText={canWrite ? "글 작성" : undefined}
            onAction={canWrite ? () => setIsUploadModalOpen(true) : undefined}
            icon="FileText"
          />
        )}
      </motion.div>

      {/* Upload Modal */}
      <BlogUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        editingPost={editingPost}
      />
    </div>
  )
}

export default InsightsPage