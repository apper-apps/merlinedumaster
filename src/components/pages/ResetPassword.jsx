import { useEffect } from 'react'

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK
        ApperUI.showResetPassword('#authentication-reset-password')
    }, [])

    return (
        <div className="flex-1 py-12 px-5 flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div id="authentication-reset-password" className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-lg"></div>
        </div>
    )
}

export default ResetPassword