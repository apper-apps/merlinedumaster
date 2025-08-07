import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Checkbox from "@/components/atoms/Checkbox"
import coursesService from "@/services/api/coursesService"

const CourseUploadModal = ({ isOpen, onClose, courseType, editingCourse = null }) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    thumbnail_url_c: "",
    allowed_roles_c: courseType === "membership" ? ["member"] : ["master"],
    is_pinned_c: false,
    curriculum: [{ title: "", url: "" }]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingCourse) {
setFormData({
        title_c: editingCourse.title_c || editingCourse.title || "",
        description_c: editingCourse.description_c || editingCourse.description || "",
        thumbnail_url_c: editingCourse.thumbnail_url_c || editingCourse.thumbnailUrl || "",
        allowed_roles_c: editingCourse.allowed_roles_c || editingCourse.allowedRoles || ["free"],
        is_pinned_c: editingCourse.is_pinned_c || editingCourse.isPinned || false,
        curriculum: editingCourse.curriculum || [{ title: "", url: "" }]
      })
    } else {
setFormData({
        title_c: "",
        description_c: "",
        thumbnail_url_c: "",
        allowed_roles_c: ["free"],
        is_pinned_c: false,
        curriculum: [{ title: "", url: "" }]
      })
    }
  }, [editingCourse, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
const courseData = {
        Name: formData.title_c,
        title_c: formData.title_c,
        description_c: formData.description_c,
        thumbnail_url_c: formData.thumbnail_url_c || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        type_c: courseType,
        allowed_roles_c: formData.allowed_roles_c,
        is_pinned_c: formData.is_pinned_c,
        curriculum: formData.curriculum.filter(item => item.title && item.url)
      }

      if (editingCourse) {
        await coursesService.update(editingCourse.Id, courseData)
        toast.success("강의가 수정되었습니다")
      } else {
        await coursesService.create(courseData)
        toast.success("강의가 등록되었습니다")
}
toast.success("강의가 성공적으로 등록되었습니다!")
      onClose()
    } catch (error) {
      console.error("강의 업로드 오류:", error)
      if (error.message) {
        toast.error(`강의 등록 실패: ${error.message}`)
      } else {
        toast.error("강의 등록 중 오류가 발생했습니다")
      }
    } finally {
      setLoading(false)
    }
  }

const handleRoleChange = (role, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        allowed_roles_c: [...prev.allowed_roles_c, role]
      }))
    } else {
setFormData(prev => ({
        ...prev,
        allowed_roles_c: prev.allowed_roles_c.filter(r => r !== role)
      }))
    }
  }

  const addCurriculumItem = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: "", url: "" }]
    }))
  }

  const removeCurriculumItem = (index) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }))
  }

  const updateCurriculumItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
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
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingCourse ? "강의 수정" : "강의 등록"}
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
                label="강의 제목"
                value={formData.title_c}
                onChange={(e) => setFormData(prev => ({ ...prev, title_c: e.target.value }))}
                required
                placeholder="강의 제목을 입력하세요"
              />

<Textarea
                label="강의 설명"
                value={formData.description_c}
                onChange={(e) => setFormData(prev => ({ ...prev, description_c: e.target.value }))}
                required
                placeholder="강의에 대한 설명을 입력하세요"
                rows={4}
              />

<Input
                label="썸네일 이미지 URL (선택사항)"
                value={formData.thumbnail_url_c}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url_c: e.target.value }))}
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
                      checked={formData.allowed_roles_c.includes(role)}
                      onChange={(e) => handleRoleChange(role, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Pin Option */}
<Checkbox
                label="상단 고정"
                checked={formData.is_pinned_c}
                onChange={(e) => setFormData(prev => ({ ...prev, is_pinned_c: e.target.checked }))}
              />

              {/* Curriculum */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    커리큘럼
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCurriculumItem}
                    icon="Plus"
                  >
                    영상 추가
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.curriculum.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          영상 {index + 1}
                        </span>
                        {formData.curriculum.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCurriculumItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <Input
                        label="영상 제목"
                        value={item.title}
                        onChange={(e) => updateCurriculumItem(index, "title", e.target.value)}
                        placeholder="영상 제목을 입력하세요"
                        required
                      />
                      
                      <Input
                        label="영상 URL"
                        value={item.url}
                        onChange={(e) => updateCurriculumItem(index, "url", e.target.value)}
                        placeholder="YouTube URL 또는 동영상 링크를 입력하세요"
                        required
                      />
                    </div>
                  ))}
                </div>
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
                  {editingCourse ? "수정하기" : "등록하기"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CourseUploadModal