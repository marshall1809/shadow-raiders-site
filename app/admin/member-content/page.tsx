'use client'
import { useEffect, useState, useRef } from 'react'
import type { MemberPost, MemberFile, PostCategory, FileCategory } from '@/lib/types'
import { POST_CATEGORY_LABELS, FILE_CATEGORY_LABELS } from '@/lib/types'

type Tab = 'posts' | 'files'

const EMPTY_POST = { title: '', body: '', category: 'announcement' as PostCategory, pinned: false, created_by: 'Admin' }

export default function AdminMemberContentPage() {
  const [tab, setTab]           = useState<Tab>('posts')
  const [posts, setPosts]       = useState<MemberPost[]>([])
  const [files, setFiles]       = useState<MemberFile[]>([])
  const [postForm, setPostForm] = useState(EMPTY_POST)
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileForm, setFileForm] = useState({ name: '', description: '', category: 'general' as FileCategory })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function loadPosts() {
    const res = await fetch('/api/member-posts')
    if (res.ok) setPosts(await res.json())
  }
  async function loadFiles() {
    const res = await fetch('/api/member-files')
    if (res.ok) setFiles(await res.json())
  }
  async function loadAll() {
    await Promise.all([loadPosts(), loadFiles()])
    setLoading(false)
  }
  useEffect(() => { loadAll() }, [])

  async function savePost() {
    setSaving(true)
    await fetch('/api/member-posts', {
      method: editingPost ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPost ? { ...postForm, id: editingPost } : postForm),
    })
    setPostForm(EMPTY_POST)
    setEditingPost(null)
    setMsg(editingPost ? 'Post updated.' : 'Post published.')
    setTimeout(() => setMsg(''), 2000)
    loadPosts()
    setSaving(false)
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    await fetch('/api/member-posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadPosts()
  }

  async function uploadFile() {
    if (!selectedFile || !fileForm.name) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', selectedFile)
    fd.append('name', fileForm.name)
    fd.append('description', fileForm.description)
    fd.append('category', fileForm.category)
    const res = await fetch('/api/member-files', { method: 'POST', body: fd })
    if (res.ok) {
      setMsg('File uploaded.')
      setTimeout(() => setMsg(''), 2000)
      setFileForm({ name: '', description: '', category: 'general' })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      loadFiles()
    } else {
      const d = await res.json()
      setMsg(`Error: ${d.error}`)
    }
    setUploading(false)
  }

  async function deleteFile(file: MemberFile) {
    if (!confirm(`Delete "${file.name}"?`)) return
    await fetch('/api/member-files', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: file.id, file_path: file.file_path }),
    })
    loadFiles()
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-[#dce6f4] mb-1">Member Content</h1>
      <p className="text-[#4a5c72] text-sm mb-8">Posts and files visible to logged-in members</p>

      {msg && <div className="mb-4 px-4 py-2 bg-[#0a1828] border border-[#c8a840] text-[#e0be58] text-sm rounded-sm">{msg}</div>}

      {/* Tabs */}
      <div className="flex border-b border-[rgba(255,255,255,0.06)] mb-8">
        {(['posts', 'files'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase border-b-2 transition-all cursor-pointer bg-transparent capitalize ${
              tab === t ? 'text-[#c8a840] border-[#c8a840]' : 'text-[#4a5c72] border-transparent hover:text-[#8090a8]'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* POSTS */}
      {tab === 'posts' && (
        <>
          <div className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-8">
            <div className="font-mono-sr text-[0.62rem] tracking-[0.22em] uppercase text-[#7a6420] mb-4">
              {editingPost ? 'Edit Post' : 'New Post'}
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Title</label>
                  <input type="text" value={postForm.title} placeholder="Post title"
                    onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
                </div>
                <div>
                  <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Category</label>
                  <select value={postForm.category} onChange={e => setPostForm(p => ({ ...p, category: e.target.value as PostCategory }))}
                    className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]">
                    {Object.entries(POST_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Body</label>
                <textarea value={postForm.body} rows={6} placeholder="Write your post here..."
                  onChange={e => setPostForm(p => ({ ...p, body: e.target.value }))}
                  className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840] resize-none leading-relaxed" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={postForm.pinned} onChange={e => setPostForm(p => ({ ...p, pinned: e.target.checked }))}
                    className="accent-[#c8a840]" />
                  <span className="text-[#8090a8] text-sm">Pin to top</span>
                </label>
                <div className="flex-1">
                  <input type="text" value={postForm.created_by} placeholder="Posted by"
                    onChange={e => setPostForm(p => ({ ...p, created_by: e.target.value }))}
                    className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={savePost} disabled={saving || !postForm.title || !postForm.body}
                  className="px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Publish Post'}
                </button>
                {editingPost && (
                  <button onClick={() => { setEditingPost(null); setPostForm(EMPTY_POST) }}
                    className="px-6 py-2.5 border border-[rgba(255,255,255,0.08)] text-[#8090a8] text-sm rounded-sm bg-transparent cursor-pointer">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <h2 className="font-display text-xl text-[#dce6f4] mb-4">Published Posts ({posts.length})</h2>
          {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
            <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
              {posts.length === 0 ? <div className="p-8 text-center text-[#4a5c72] text-sm">No posts yet.</div>
              : posts.map(post => (
                <div key={post.id} className="flex items-start gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {post.pinned && <span className="text-[#c8a840] text-xs">📌</span>}
                      <span className="text-[#dce6f4] text-sm font-medium truncate">{post.title}</span>
                    </div>
                    <div className="text-[#4a5c72] text-xs font-mono-sr">{POST_CATEGORY_LABELS[post.category as PostCategory]} · {new Date(post.created_at).toLocaleDateString('en-GB')}</div>
                  </div>
                  <button onClick={() => { setEditingPost(post.id); setPostForm({ title: post.title, body: post.body, category: post.category as PostCategory, pinned: post.pinned, created_by: post.created_by }); window.scrollTo({top:0,behavior:'smooth'}) }}
                    className="text-[#c8a840] text-xs hover:underline bg-transparent border-none cursor-pointer flex-shrink-0">Edit</button>
                  <button onClick={() => deletePost(post.id)}
                    className="text-red-500 text-xs hover:underline bg-transparent border-none cursor-pointer flex-shrink-0">Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FILES */}
      {tab === 'files' && (
        <>
          <div className="bg-[#07111e] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 mb-8">
            <div className="font-mono-sr text-[0.62rem] tracking-[0.22em] uppercase text-[#7a6420] mb-4">Upload File</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">File</label>
                <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; setSelectedFile(f || null); if (f && !fileForm.name) setFileForm(p => ({ ...p, name: f.name.replace(/\.[^.]+$/, '') })) }}
                  className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#8090a8] text-sm focus:outline-none focus:border-[#c8a840] file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:bg-[#c8a840] file:text-[#04090f] file:text-xs file:font-semibold file:cursor-pointer" />
              </div>
              <div>
                <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Display Name</label>
                <input type="text" value={fileForm.name} placeholder="Friendly name for members"
                  onChange={e => setFileForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
              </div>
              <div>
                <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Category</label>
                <select value={fileForm.category} onChange={e => setFileForm(p => ({ ...p, category: e.target.value as FileCategory }))}
                  className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]">
                  {Object.entries(FILE_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="font-mono-sr text-[0.58rem] tracking-[0.2em] uppercase text-[#4a5c72] block mb-1">Description (optional)</label>
                <input type="text" value={fileForm.description} placeholder="Brief description"
                  onChange={e => setFileForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#04090f] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 text-[#dce6f4] text-sm focus:outline-none focus:border-[#c8a840]" />
              </div>
            </div>
            <button onClick={uploadFile} disabled={uploading || !selectedFile || !fileForm.name}
              className="mt-4 px-8 py-2.5 bg-[#c8a840] text-[#04090f] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#e0be58] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
            <p className="text-[#2a3a50] text-xs mt-2">Accepted: PDF, images, Word docs, ZIP, and most common formats. Max ~50MB.</p>
          </div>

          <h2 className="font-display text-xl text-[#dce6f4] mb-4">Uploaded Files ({files.length})</h2>
          {loading ? <p className="text-[#4a5c72] text-sm">Loading...</p> : (
            <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
              {files.length === 0 ? <div className="p-8 text-center text-[#4a5c72] text-sm">No files uploaded yet.</div>
              : files.map(file => (
                <div key={file.id} className="flex items-center gap-4 px-5 py-4 bg-[#07111e] hover:bg-[#0a1828] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-[#dce6f4] text-sm font-medium truncate">{file.name}</div>
                    <div className="text-[#4a5c72] text-xs font-mono-sr">{FILE_CATEGORY_LABELS[file.category as FileCategory]} · {new Date(file.created_at).toLocaleDateString('en-GB')}</div>
                  </div>
                  <button onClick={() => deleteFile(file)}
                    className="text-red-500 text-xs hover:underline bg-transparent border-none cursor-pointer flex-shrink-0">Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
