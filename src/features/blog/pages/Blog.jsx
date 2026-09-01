import React from 'react'
import { Link } from 'react-router-dom'
import { demoStore } from '../../../lib/supabase'
import { FaArrowLeft } from 'react-icons/fa6'

export default function Blog() {
  const posts = demoStore.getPosts().filter(p => p.status === 'published')

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs text-[#C4A070] tracking-widest font-bold uppercase">المجلة المعمارية</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F2EFE8]">أحدث المقالات والإلهام</h1>
        <p className="text-xs md:text-sm text-[#B3A9A3]">استكشف مقالات متخصصة في التصميم الفاخر وفنون التأثيث الراقي</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="glass-panel-luxury rounded-3xl overflow-hidden flex flex-col justify-between group">
            <div className="h-64 overflow-hidden">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-[#C4A070] mb-2">
                  <span>{post.category_name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at || Date.now()).toLocaleDateString('ar-SA')}</span>
                </div>
                <h3 className="text-xl font-bold text-[#F2EFE8] group-hover:text-[#C4A070] transition-colors mb-2">{post.title}</h3>
                <p className="text-xs text-[#B3A9A3] leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
              <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-xs text-[#C4A070] font-semibold pt-4 border-t border-white/5">
                <span>قراءة المقال بالكامل</span>
                <FaArrowLeft className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
