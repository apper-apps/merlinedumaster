import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ 
  label,
  checked,
  className,
  ...props 
}, ref) => {
  return (
    <label className={cn("flex items-center space-x-3 cursor-pointer", className)}>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="sr-only"
          {...props}
        />
        <div className={cn(
          "w-5 h-5 border-2 rounded transition-all duration-200",
          checked 
            ? "bg-primary-500 border-primary-500" 
            : "border-gray-300 hover:border-primary-300"
        )}>
          {checked && (
            <ApperIcon name="Check" className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox