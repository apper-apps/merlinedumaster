import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-lg",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500 shadow-lg",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-lg",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-300"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
  
  return (
    <button
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
      ) : (
        icon && iconPosition === "left" && <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && <ApperIcon name={icon} className="w-4 h-4 ml-2" />}
    </button>
  )
})

Button.displayName = "Button"

export default Button