import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ToastContainer from '../components/Toast'
import { ToastProvider } from '../hooks/useToast'

export default function AppLayout() {
  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  )
}
