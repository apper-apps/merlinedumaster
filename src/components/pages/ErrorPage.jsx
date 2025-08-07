import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const errorMessage = searchParams.get('message') || '오류가 발생했습니다'
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">인증 오류</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <Link to="/login" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage