import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './features/admin/pages/ProtectedRoute'
import AdminLayout from './features/admin/pages/AdminLayout'
import { PageLoading } from './components/ui/Loading'
import ScriptInjector from './components/layout/ScriptInjector'
import RedirectGuard from './components/layout/RedirectGuard'

const Home = lazy(() => import('./features/home/pages/Home'))
const Services = lazy(() => import('./features/services/pages/Services'))
const ServiceDetail = lazy(() => import('./features/services/pages/ServiceDetail'))
const Offers = lazy(() => import('./features/offers/pages/Offers'))
const OfferDetail = lazy(() => import('./features/offers/pages/OfferDetail'))
const Blog = lazy(() => import('./features/blog/pages/Blog'))
const BlogDetail = lazy(() => import('./features/blog/pages/BlogDetail'))
const About = lazy(() => import('./features/about/pages/About'))

const Login = lazy(() => import('./features/admin/pages/Login'))
const AdminPosts = lazy(() => import('./features/blog/pages/AdminPosts'))
const AdminPostPreview = lazy(() => import('./features/blog/pages/AdminPostPreview'))
const AdminServices = lazy(() => import('./features/services/pages/AdminServices'))
const AdminOffers = lazy(() => import('./features/offers/pages/AdminOffers'))
const AdminMedia = lazy(() => import('./features/admin/pages/AdminMedia'))
const AdminCategories = lazy(() => import('./features/admin/pages/AdminCategories'))
const AdminRedirects = lazy(() => import('./features/admin/pages/AdminRedirects'))
const AdminSettings = lazy(() => import('./features/admin/pages/AdminSettings'))

export default function App() {
  return (
    <RedirectGuard>
      <ScriptInjector />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="offers" element={<Offers />} />
            <Route path="offers/:slug" element={<OfferDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="about" element={<About />} />
          </Route>

          <Route path="admin/login" element={<Login />} />

          <Route path="admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="posts" replace />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/preview/:id" element={<AdminPostPreview />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="redirects" element={<AdminRedirects />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </RedirectGuard>
  )
}
