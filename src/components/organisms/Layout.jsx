import Header from "@/components/organisms/Header"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout