import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Checkbox from "@/components/atoms/Checkbox"
import NotionEditor from "@/components/molecules/NotionEditor"
import blogsService from "@/services/api/blogsService"

const BlogUploadModal = ({ isOpen, onClose, editingPost = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnailUrl: "",
    allowedRoles: ["free"]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        content: editingPost.content || "",
        thumbnailUrl: editingPost.thumbnailUrl || "",
        allowedRoles: editingPost.allowedRoles || ["free"]
      })
    } else {
      setFormData({
        title: "",
        content: "",
        thumbnailUrl: "",
        allowedRoles: ["free"]
      })
    }
  }, [editingPost, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const postData = {
        ...formData,
        thumbnailUrl: formData.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        publishedAt: editingPost ? editingPost.publishedAt : new Date().toISOString()
      }

      if (editingPost) {
        await blogsService.update(editingPost.Id, postData)
        toast.success("글이 수정되었습니다")
      } else {
        await blogsService.create(postData)
        toast.success("글이 발행되었습니다")
      }
      
      onClose()
      window.location.reload() // Refresh to show changes
    } catch (error) {
      toast.error("오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (role, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        allowedRoles: [...prev.allowedRoles, role]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        allowedRoles: prev.allowedRoles.filter(r => r !== role)
      }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingPost ? "글 수정" : "새 글 작성"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <Input
                label="제목"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="글 제목을 입력하세요"
              />

              <Input
                label="썸네일 이미지 URL (선택사항)"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />

              {/* Role Permissions */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  접근 권한
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["free", "member", "master", "both"].map((role) => (
                    <Checkbox
                      key={role}
                      label={role}
                      checked={formData.allowedRoles.includes(role)}
                      onChange={(e) => handleRoleChange(role, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  내용
                </label>
                <NotionEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="내용을 입력하세요..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  {editingPost ? "수정하기" : "발행하기"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BlogUploadModal