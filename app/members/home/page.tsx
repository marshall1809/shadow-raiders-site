'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { MemberPost, MemberFile, PostCategory, FileCategory } from '@/lib/types'
import { POST_CATEGORY_LABELS, FILE_CATEGORY_LABELS } from '@/lib/types'

type Tab = 'posts' | 'files'

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const CATEGORY_COLORS: Record<PostCategory, string> = {
  announcement: 'border-[#c8a840] text-[#c8a840]',
  tactics:      'border-[#5a82a8] text-[#5a82a8]',
  news:         'border-green-700 text-green-400',
  other:        'border-[#4a5c72] text-[#4a5c72]',
}

const FILE_ICONS: Record<string, string> = {
  'application/pdf': '📄',
  'image/png': '🖼',
  'image/jpeg': '🖼',
  'image/gif': '🖼',
  'video/mp4': '🎬',
  'application/zip': '📦',
  'text/plain': '📝',
}

function fileIcon(type: string) {
  return FILE_ICONS[type] || '📎'
}

export default function MembersHomePage() {
  const [tab, setTab]         = useState<Tab>('posts')
  const [posts, setPosts]     = useState<MemberPost[]>([])
  const [files, setFiles]     = useState<MemberFile[]>([])
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const router = useRouter()

  const load = useCallback(async () => {
    const [postsRes, filesRes] = await Promise.all([
      fetch('/api/member-posts'),
      fetch('/api/member-files'),
    ])
    if (postsRes.status === 401) {
      router.push('/members')
      return
    }
    if (postsRes.ok) setPosts(await postsRes.json())
    if (filesRes.ok) setFiles(await filesRes.json())
    setLoading(false)
  }, [router])

  useEffect(() => {
    // Check session via cookie — if the API returns 401, redirect to login
    load()
    // Try to get username from a session check endpoint
    fetch('/api/members-auth/me').then(async r => {
      if (r.ok) {
        const d = await r.json()
        setUsername(d.username || '')
      }
      setAuthChecked(true)
    }).catch(() => setAuthChecked(true))
  }, [load])

  async function handleLogout() {
    await fetch('/api/members-auth', { method: 'DELETE' })
    router.push('/members')
  }

  async function downloadFile(file: MemberFile) {
    // Get a fresh signed URL
    const res = await fetch('/api/member-files', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_path: file.file_path }),
    })
    const { url } = await res.json()
    if (url) window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04090f] flex items-center justify-center">
        <div className="font-mono-sr text-[#4a5c72] text-sm tracking-widest">Loading...</div>
      </div>
    )
  }

  const pinnedPosts = posts.filter(p => p.pinned)
  const regularPosts = posts.filter(p => !p.pinned)

  return (
    <div className="min-h-screen bg-[#04090f]">
      {/* Header */}
      <header className="border-b border-[rgba(255,255,255,0.06)] bg-[#07111e] sticky top-0 z-40">
        <div className="max-w-[1100px] mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-display text-[#c8a840] text-xl">Members Area</div>
            <span className="hidden sm:inline font-mono-sr text-[#4a5c72] text-[0.58rem] tracking-widest">Shadow Raiders</span>
          </div>
          <div className="flex items-center gap-4">
            {username && (
              <span className="hidden sm:block font-mono-sr text-[#8090a8] text-xs tracking-wide">
                {username}
              </span>
            )}
            <a href="/" className="text-[#4a5c72] text-xs hover:text-[#8090a8] transition-colors">
              ← Site
            </a>
            <button
              onClick={handleLogout}
              className="text-xs font-mono-sr text-[#4a5c72] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer tracking-wide"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-[#dce6f4] mb-1">
            Welcome{username ? `, ${username}` : ''}.
          </h1>
          <p className="text-[#4a5c72] text-sm font-light">Shadow Raiders private member area. Keep this access to yourself.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[rgba(255,255,255,0.06)] mb-8">
          {(['posts', 'files'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium tracking-widest uppercase border-b-2 transition-all cursor-pointer bg-transparent ${
                tab === t
                  ? 'text-[#c8a840] border-[#c8a840]'
                  : 'text-[#4a5c72] border-transparent hover:text-[#8090a8]'
              }`}
            >
              {t === 'posts' ? `Posts (${posts.length})` : `Files (${files.length})`}
            </button>
          ))}
        </div>

        {/* POSTS TAB */}
        {tab === 'posts' && (
          <div className="flex flex-col gap-4">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-[#4a5c72]">
                <div className="font-display text-3xl mb-2">No posts yet</div>
                <div className="text-sm font-light">Check back soon for announcements.</div>
              </div>
            ) : (
              <>
                {/* Pinned posts */}
                {pinnedPosts.length > 0 && (
                  <>
                    <div className="font-mono-sr text-[0.6rem] tracking-[0.22em] uppercase text-[#c8a840] mb-1">📌 Pinned</div>
                    {pinnedPosts.map(post => (
                      <PostCard key={post.id} post={post} expanded={expandedPost === post.id} onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)} />
                    ))}
                    {regularPosts.length > 0 && <div className="font-mono-sr text-[0.6rem] tracking-[0.22em] uppercase text-[#4a5c72] mt-2 mb-1">Latest</div>}
                  </>
                )}
                {regularPosts.map(post => (
                  <PostCard key={post.id} post={post} expanded={expandedPost === post.id} onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)} />
                ))}
              </>
            )}
          </div>
        )}

        {/* FILES TAB */}
        {tab === 'files' && (
          <div>
            {files.length === 0 ? (
              <div className="text-center py-20 text-[#4a5c72]">
                <div className="font-display text-3xl mb-2">No files yet</div>
                <div className="text-sm font-light">Documents and resources will appear here.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
                {(['general','tactics','rules','media'] as FileCategory[]).map(cat => {
                  const catFiles = files.filter(f => f.category === cat)
                  if (catFiles.length === 0) return null
                  return (
                    <div key={cat}>
                      <div className="px-5 py-2 bg-[#04090f] font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72]">
                        {FILE_CATEGORY_LABELS[cat]}
                      </div>
                      {catFiles.map(file => (
                        <div key={file.id} className="flex items-center gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors border-t border-[rgba(255,255,255,0.04)]">
                          <div className="text-xl flex-shrink-0">{fileIcon(file.file_type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[#dce6f4] text-sm font-medium truncate">{file.name}</div>
                            {file.description && (
                              <div className="text-[#4a5c72] text-xs font-light mt-0.5">{file.description}</div>
                            )}
                            <div className="text-[#2a3a50] text-xs mt-0.5 font-mono-sr">
                              {formatDate(file.created_at)}{file.file_size ? ` · ${formatFileSize(file.file_size)}` : ''}
                            </div>
                          </div>
                          <button
                            onClick={() => downloadFile(file)}
                            className="flex-shrink-0 px-4 py-2 border border-[#7a6420] text-[#c8a840] text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#c8a840] hover:text-[#04090f] transition-all bg-transparent cursor-pointer"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post, expanded, onToggle }: { post: MemberPost; expanded: boolean; onToggle: () => void }) {
  return (
    <div className={`bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden transition-all ${post.pinned ? 'border-[rgba(200,168,64,0.15)]' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-start gap-4 cursor-pointer bg-transparent border-none hover:bg-[#0a1828] transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className={`font-mono-sr text-[0.55rem] tracking-[0.18em] uppercase px-2 py-0.5 border rounded-sm ${CATEGORY_COLORS[post.category as PostCategory]}`}>
              {POST_CATEGORY_LABELS[post.category as PostCategory]}
            </span>
            {post.pinned && <span className="text-[#c8a840] text-xs">📌</span>}
          </div>
          <div className="text-[#dce6f4] text-sm font-semibold leading-snug">{post.title}</div>
          <div className="text-[#4a5c72] text-xs mt-1 font-mono-sr">
            {post.created_by} · {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <span className="text-[#4a5c72] text-sm flex-shrink-0 transition-transform duration-200 mt-1" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {expanded && (
        <div className="px-6 pb-6 border-t border-[rgba(255,255,255,0.04)]">
          <div className="pt-4 text-[#8090a8] text-sm font-light leading-relaxed whitespace-pre-wrap">{post.body}</div>
        </div>
      )}
    </div>
  )
}
