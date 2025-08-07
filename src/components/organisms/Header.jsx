import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Header = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null) // null for not logged in

  // Mock login function
  const handleLogin = () => {
    setCurrentUser({ role: "admin", name: "관리자" }) // Mock admin login
    setIsLoginModalOpen(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const navItems = [
    { name: "홈", path: "/" },
    { name: "멤버십", path: "/membership" },
    { name: "마스터", path: "/master" },
    { name: "인사이트", path: "/insights" },
    { name: "도전 후기", path: "/testimonials" }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <motion.header
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                EduMaster
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  {currentUser.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-accent-600 hover:text-accent-700 font-medium text-sm"
                    >
                      관리자
                    </Link>
                  )}
                  <span className="text-sm text-gray-700">
                    {currentUser.name}님
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    로그인
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsSignupModalOpen(true)}
                  >
                    회원가입
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 bg-white"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700"
                        : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {currentUser ? (
                    <>
                      {currentUser.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-3 rounded-lg text-sm font-medium text-accent-600 hover:bg-accent-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          관리자
                        </Link>
                      )}
                      <div className="px-4 py-2 text-sm text-gray-700">
                        {currentUser.name}님
                      </div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                      >
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true)
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                      >
                        로그인
                      </button>
                      <button
                        onClick={() => {
                          setIsSignupModalOpen(true)
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50"
                      >
                        회원가입
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Login Modal - Note: As per requirements, these are just UI mockups */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">로그인</h2>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleLogin}
                >
                  로그인
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Modal - Note: As per requirements, these are just UI mockups */}
      <AnimatePresence>
        {isSignupModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">회원가입</h2>
                <button
                  onClick={() => setIsSignupModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsSignupModalOpen(false)}
                >
                  회원가입
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header