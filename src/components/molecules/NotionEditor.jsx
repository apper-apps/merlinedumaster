import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotionEditor = ({ value, onChange, placeholder = "내용을 입력하세요..." }) => {
  const [isHTMLMode, setIsHTMLMode] = useState(false)
  const [selection, setSelection] = useState({ start: 0, end: 0 })

  const formatText = (format) => {
    const textarea = document.querySelector(".notion-editor")
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let formattedText = ""
    switch (format) {
      case "bold":
        formattedText = isHTMLMode ? `<strong>${selectedText}</strong>` : `**${selectedText}**`
        break
      case "italic":
        formattedText = isHTMLMode ? `<em>${selectedText}</em>` : `*${selectedText}*`
        break
      case "underline":
        formattedText = isHTMLMode ? `<u>${selectedText}</u>` : `__${selectedText}__`
        break
      case "heading1":
        formattedText = isHTMLMode ? `<h1>${selectedText}</h1>` : `# ${selectedText}`
        break
      case "heading2":
        formattedText = isHTMLMode ? `<h2>${selectedText}</h2>` : `## ${selectedText}`
        break
      case "heading3":
        formattedText = isHTMLMode ? `<h3>${selectedText}</h3>` : `### ${selectedText}`
        break
      case "quote":
        formattedText = isHTMLMode ? `<blockquote>${selectedText}</blockquote>` : `> ${selectedText}`
        break
      case "code":
        formattedText = isHTMLMode ? `<code>${selectedText}</code>` : `\`${selectedText}\``
        break
      case "link":
        const url = prompt("링크 URL을 입력하세요:")
        if (url) {
          formattedText = isHTMLMode ? `<a href="${url}">${selectedText || url}</a>` : `[${selectedText || "링크"}](${url})`
        }
        break
      default:
        formattedText = selectedText
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    onChange(newValue)
  }

  const insertList = (type) => {
    const textarea = document.querySelector(".notion-editor")
    const start = textarea.selectionStart
    const lines = value.substring(0, start).split("\n")
    const currentLine = lines.length - 1
    const lineStart = value.lastIndexOf("\n", start - 1) + 1
    
    let listItem = ""
    if (type === "bullet") {
      listItem = isHTMLMode ? "<li></li>" : "- "
    } else {
      listItem = isHTMLMode ? "<li></li>" : "1. "
    }
    
    const newValue = value.substring(0, lineStart) + listItem + value.substring(lineStart)
    onChange(newValue)
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => formatText("bold")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="굵게 (Ctrl+B)"
          >
            <ApperIcon name="Bold" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText("italic")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="기울임 (Ctrl+I)"
          >
            <ApperIcon name="Italic" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText("underline")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="밑줄 (Ctrl+U)"
          >
            <ApperIcon name="Underline" className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => formatText("heading1")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors text-xs font-bold"
            title="제목 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => formatText("heading2")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors text-xs font-bold"
            title="제목 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => formatText("heading3")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors text-xs font-bold"
            title="제목 3"
          >
            H3
          </button>
        </div>

        {/* Lists and Blocks */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => insertList("bullet")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="불릿 리스트"
          >
            <ApperIcon name="List" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertList("number")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="번호 리스트"
          >
            <ApperIcon name="ListOrdered" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText("quote")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="인용"
          >
            <ApperIcon name="Quote" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText("code")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="코드"
          >
            <ApperIcon name="Code" className="w-4 h-4" />
          </button>
        </div>

        {/* Link */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => formatText("link")}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="링크"
          >
            <ApperIcon name="Link" className="w-4 h-4" />
          </button>
        </div>

        {/* HTML Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsHTMLMode(!isHTMLMode)}
          className={`p-1.5 rounded transition-colors text-xs font-mono ${
            isHTMLMode 
              ? "bg-primary-100 text-primary-700" 
              : "hover:bg-gray-200"
          }`}
          title="HTML 모드 전환"
        >
          HTML
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          className="notion-editor w-full p-4 min-h-[300px] resize-vertical focus:outline-none font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onSelect={(e) => setSelection({ start: e.target.selectionStart, end: e.target.selectionEnd })}
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>{isHTMLMode ? "HTML 모드" : "마크다운 모드"}</span>
        <span>{value.length}자</span>
      </div>
    </div>
  )
}

export default NotionEditor