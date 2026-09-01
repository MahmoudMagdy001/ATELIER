import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { demoStore } from '../../../lib/supabase'
import { FaArrowRight } from 'react-icons/fa6'

export default function BlogDetail() {
  const { slug } = useParams()
  const posts = demoStore.getPosts()
  const post = posts.find(p => p.slug === slug) || posts[0]

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-[#C4A070]">
        <FaArrowRight /> <span>العودة للمجلة</span>
      </Link>

      <article className="glass-panel-luxury rounded-3xl p-8 md:p-12 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-[#C4A070]">
            <span>{post.category_name}</span>
            <span>•</span>
            <span>{new Date(post.created_at || Date.now()).toLocaleDateString('ar-SA')}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F2EFE8] leading-tight">{post.title}</h1>
          <p className="text-sm text-[#D4B58C] border-r-2 border-[#C4A070] pr-4">{post.excerpt}</p>
        </div>

        <img src={post.cover_image} alt={post.title} className="w-full h-96 object-cover rounded-2xl border border-[#C4A070]/20" />

        <div className="html-content text-[#DEDAD6] text-sm md:text-base leading-loose pt-4 border-t border-white/5" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  )
}
