import { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '@/App'

function Signup() {
  const { isInitialized } = useContext(AuthContext)
  
  useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#authentication")
    }
  }, [isInitialized])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white text-2xl 2xl:text-3xl font-bold">
            준
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              준태스쿨 계정 만들기
            </div>
            <div className="text-center text-sm text-gray-500">
              계정을 만들어 학습을 시작하세요
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup