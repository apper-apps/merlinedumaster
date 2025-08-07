import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import BlogCard from "@/components/molecules/BlogCard"
import BlogUploadModal from "@/components/organisms/BlogUploadModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import blogsService from "@/services/api/blogsService"

const BlogPostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Mock user role - in real app, this would come from authentication
  const userRole = "admin" // Could be: "free", "member", "master", "both", "admin"
  const canEdit = ["admin", "both"].includes(userRole)

  const loadPost = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [postData, allPosts] = await Promise.all([
        blogsService.getById(parseInt(postId)),
        blogsService.getAll()
      ])
      
      setPost(postData)
      
      // Get related posts (exclude current post, limit to 3)
      const related = allPosts
        .filter(p => p.Id !== postData.Id)
        .slice(0, 3)
      
      setRelatedPosts(related)
    } catch (err) {
      setError("글을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (postId) {
      loadPost()
    }
  }, [postId])

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

  const renderContent = (content) => {
    // Simple HTML rendering - in a real app, you'd want to sanitize this
    return { __html: content }
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    loadPost() // Refresh post data
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-8 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" 
                 style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadPost} />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message="글을 찾을 수 없습니다." onRetry={() => navigate("/insights")} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={() => navigate("/insights")}
          className="hover:bg-primary-50"
        >
          인사이트 목록으로
        </Button>
      </motion.div>

      {/* Post Header */}
      <motion.article
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Featured Image */}
        <div className="h-64 md:h-80 overflow-hidden">
          <img
            src={post.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
              {format(new Date(post.publishedAt), "yyyy년 M월 d일", { locale: ko })}
            </div>
            
            <div className="flex flex-wrap gap-2">
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

            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                icon="Edit3"
                onClick={() => setIsEditModalOpen(true)}
                className="ml-auto"
              >
                수정
              </Button>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-strong:text-gray-900 prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50 prose-blockquote:text-primary-800"
            dangerouslySetInnerHTML={renderContent(post.content)}
          />
        </div>
      </motion.article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              관련 글
            </h2>
            <p className="text-gray-600">
              함께 읽으면 좋은 다른 인사이트들을 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <BlogCard
                key={relatedPost.Id}
                post={relatedPost}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Edit Modal */}
      <BlogUploadModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        editingPost={post}
      />
    </div>
  )
}

export default BlogPostPage