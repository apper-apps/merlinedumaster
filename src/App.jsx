import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import HomePage from "@/components/pages/HomePage"
import MembershipPage from "@/components/pages/MembershipPage"
import MasterPage from "@/components/pages/MasterPage"
import InsightsPage from "@/components/pages/InsightsPage"
import TestimonialsPage from "@/components/pages/TestimonialsPage"
import VideoPlayerPage from "@/components/pages/VideoPlayerPage"
import BlogPostPage from "@/components/pages/BlogPostPage"
import AdminDashboard from "@/components/pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/master" element={<MasterPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/video/:courseId/:videoId" element={<VideoPlayerPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App