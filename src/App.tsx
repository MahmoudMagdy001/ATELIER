import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { PageLoading } from './components/ui/Loading'

// Admin shell components — lazy-loaded so auth + admin nav don't bloat the public bundle
const ProtectedRoute = lazy(() => import('./features/admin/pages/ProtectedRoute'))
const AdminLayout = lazy(() => import('./features/admin/pages/AdminLayout'))
import ScriptInjector from './components/layout/ScriptInjector'
import RedirectGuard from './components/layout/RedirectGuard'
import ScrollRestoration from './components/layout/ScrollRestoration'

// Public Pages
const Home = lazy(() => import('./features/home/pages/Home'))
const Products = lazy(() => import('./features/products/pages/Products'))
const ProductDetail = lazy(() => import('./features/products/pages/ProductDetail'))
const BespokeService = lazy(() => import('./features/bespoke/pages/BespokeService'))
const Offers = lazy(() => import('./features/offers/pages/Offers'))
const OfferDetail = lazy(() => import('./features/offers/pages/OfferDetail'))
const Blog = lazy(() => import('./features/blog/pages/Blog'))
const BlogDetail = lazy(() => import('./features/blog/pages/BlogDetail'))

// Admin Pages
const Login = lazy(() => import('./features/admin/pages/Login'))
const AdminProducts = lazy(() => import('./features/products/pages/AdminProducts'))
const AdminPortfolio = lazy(() => import('./features/portfolio/pages/AdminPortfolio'))
const AdminPosts = lazy(() => import('./features/blog/pages/AdminPosts'))
const AdminPostPreview = lazy(() => import('./features/blog/pages/AdminPostPreview'))
const AdminOffers = lazy(() => import('./features/offers/pages/AdminOffers'))
const AdminMedia = lazy(() => import('./features/admin/pages/AdminMedia'))
const AdminCategories = lazy(() => import('./features/admin/pages/AdminCategories'))
const AdminRedirects = lazy(() => import('./features/admin/pages/AdminRedirects'))
const AdminSettings = lazy(() => import('./features/admin/pages/AdminSettings'))
const AdminInquiries = lazy(() => import('./features/admin/pages/AdminInquiries'))

export default function App() {
  return (
    <RedirectGuard>
      <ScrollRestoration />
      <ScriptInjector />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public Storefront Layout */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* 1. Limited Edition (Replaces /products) */}
            <Route path="limited-edition" element={<Products />} />
            <Route path="limited-edition/:slug" element={<ProductDetail />} />
            
            {/* 2. Bespoke Service Page */}
            <Route path="bespoke" element={<BespokeService />} />

            {/* Legacy & Clean Routes */}
            <Route path="products" element={<Navigate to="/limited-edition" replace />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="services" element={<Navigate to="/bespoke" replace />} />
            <Route path="services/:slug" element={<Navigate to="/bespoke" replace />} />
            <Route path="about" element={<Navigate to="/" replace />} />
            
            {/* Offers & Blog (Kept accessible for direct links if any, but clean redirects) */}
            <Route path="offers" element={<Offers />} />
            <Route path="offers/:slug" element={<OfferDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
          </Route>

          {/* Admin Login */}
          <Route path="admin/login" element={<Login />} />

          {/* Protected Admin Panel */}
          <Route path="admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="products" replace />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="redirects" element={<AdminRedirects />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="inquiries" element={<AdminInquiries />} />

              {/* Footer Access for Posts & Offers */}
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/preview/:id" element={<AdminPostPreview />} />
              <Route path="offers" element={<AdminOffers />} />
            </Route>
          </Route>

          {/* Catch-all fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </RedirectGuard>
  )
}
