import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  User, Zap, Briefcase, GraduationCap, FolderOpen,
  Image, LogOut, Save, Plus, Trash2, Edit3, X, Upload,
  FileText, Eye, ChevronRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePortfolio } from '../hooks/usePortfolio'
import { PortfolioData, Skill, Experience, Education, Project } from '../types/portfolio'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'media', label: 'Media', icon: Image },
]

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function Admin() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const { data, refetch, setData } = usePortfolio()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const headers = { Authorization: `Bearer ${token}` }

  async function saveSection(section: string, payload: unknown) {
    setSaving(true)
    try {
      const { data: updated } = await axios.put<PortfolioData>('/api/portfolio', { [section]: payload }, { headers })
      setData(updated)
      toast.success('Saved successfully!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <div className="w-8 h-8 rounded-full border-2 border-t-violet-500 border-white/10 animate-spin" />
      </div>
    )
  }

  const tabProps = { data, saveSection, saving, headers, refetch }

  function renderTab() {
    switch (activeTab) {
      case 'profile': return <ProfileTab {...tabProps} />
      case 'skills': return <SkillsTab {...tabProps} />
      case 'experience': return <ExperienceTab {...tabProps} />
      case 'education': return <EducationTab {...tabProps} />
      case 'projects': return <ProjectsTab {...tabProps} />
      case 'media': return <MediaTab {...tabProps} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 flex flex-col glass border-r border-white/5
        transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center
              font-bold text-sm font-display text-white shadow-lg shadow-violet-500/30">
              {data.personal.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">{data.personal.name}</p>
              <p className="text-white/30 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/25'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={16} />
                {tab.label}
                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <a href="/" target="_blank"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/40
              hover:text-white hover:bg-white/5 transition-all duration-200">
            <Eye size={16} /> View Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/70
              hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 glass border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60"
            onClick={() => setSidebarOpen(true)}
          >
            <div className="space-y-1">
              <div className="w-4 h-0.5 bg-current" />
              <div className="w-4 h-0.5 bg-current" />
              <div className="w-3 h-0.5 bg-current" />
            </div>
          </button>
          <div>
            <h1 className="font-display font-bold text-white text-lg">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-white/30 text-xs">Manage portfolio content</p>
          </div>
          {saving && (
            <div className="ml-auto flex items-center gap-2 text-violet-400 text-sm">
              <div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
              Saving...
            </div>
          )}
        </header>

        {/* Tab content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

// ─────────────────────── Sub-Tabs ───────────────────────

interface TabProps {
  data: PortfolioData
  saveSection: (section: string, payload: unknown) => Promise<void>
  saving: boolean
  headers: Record<string, string>
  refetch: () => void
}

// ─── PROFILE TAB ───
function ProfileTab({ data, saveSection, saving }: TabProps) {
  const [form, setForm] = useState(data.personal)

  const fields: { key: keyof typeof form; label: string; type?: string; multiline?: boolean }[] = [
    { key: 'name', label: 'Full Name' },
    { key: 'title', label: 'Job Title' },
    { key: 'subtitle', label: 'Hero Subtitle', multiline: true },
    { key: 'bio', label: 'Bio', multiline: true },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone' },
    { key: 'location', label: 'Location' },
    { key: 'github', label: 'GitHub URL', type: 'url' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
    { key: 'twitter', label: 'Twitter URL', type: 'url' },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, type, multiline }) => (
          <div key={key} className={multiline ? 'sm:col-span-2' : ''}>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">{label}</label>
            {multiline ? (
              <textarea
                className="input-field resize-none h-24"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            ) : (
              <input
                type={type || 'text'}
                className="input-field"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="btn-primary flex items-center gap-2"
        onClick={() => saveSection('personal', form)}
        disabled={saving}
      >
        <Save size={16} /> Save Changes
      </button>
    </div>
  )
}

// ─── SKILLS TAB ───
function SkillsTab({ data, saveSection, saving }: TabProps) {
  const [skills, setSkills] = useState<Skill[]>(data.skills)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [isNew, setIsNew] = useState(false)

  const emptySkill: Skill = { id: '', name: '', level: 80, category: 'Frontend', icon: '⚡' }

  function openEdit(skill: Skill) { setEditing({ ...skill }); setIsNew(false) }
  function openNew() { setEditing({ ...emptySkill, id: genId() }); setIsNew(true) }
  function close() { setEditing(null) }

  function save() {
    if (!editing) return
    const updated = isNew ? [...skills, editing] : skills.map(s => s.id === editing.id ? editing : s)
    setSkills(updated)
    saveSection('skills', updated)
    close()
  }

  function remove(id: string) {
    const updated = skills.filter(s => s.id !== id)
    setSkills(updated)
    saveSection('skills', updated)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{skills.length} skills total</p>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={15} /> Add Skill
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="glass-card p-4 flex items-center gap-3">
            <span className="text-xl">{skill.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{skill.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                    style={{ width: `${skill.level}%` }} />
                </div>
                <span className="text-white/40 text-xs w-8 text-right">{skill.level}%</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(skill)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <Edit3 size={14} />
              </button>
              <button onClick={() => remove(skill.id)}
                className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <Modal title={isNew ? 'Add Skill' : 'Edit Skill'} onClose={close} onSave={save} saving={saving}>
            <div className="space-y-4">
              <Field label="Skill Name">
                <input className="input-field" value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <input className="input-field" value={editing.category}
                    onChange={e => setEditing({ ...editing, category: e.target.value })} />
                </Field>
                <Field label="Icon (emoji)">
                  <input className="input-field" value={editing.icon}
                    onChange={e => setEditing({ ...editing, icon: e.target.value })} />
                </Field>
              </div>
              <Field label={`Level: ${editing.level}%`}>
                <input type="range" min={0} max={100} value={editing.level}
                  onChange={e => setEditing({ ...editing, level: Number(e.target.value) })}
                  className="w-full accent-violet-500" />
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                    style={{ width: `${editing.level}%`, transition: 'width 0.2s' }} />
                </div>
              </Field>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── EXPERIENCE TAB ───
function ExperienceTab({ data, saveSection, saving }: TabProps) {
  const [items, setItems] = useState<Experience[]>(data.experience)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [isNew, setIsNew] = useState(false)

  const empty: Experience = { id: '', company: '', position: '', startDate: '', endDate: '', current: false, description: '', technologies: [] }

  function openNew() { setEditing({ ...empty, id: genId() }); setIsNew(true) }
  function openEdit(item: Experience) { setEditing({ ...item, technologies: [...item.technologies] }); setIsNew(false) }
  function close() { setEditing(null) }

  function save() {
    if (!editing) return
    const updated = isNew ? [...items, editing] : items.map(i => i.id === editing.id ? editing : i)
    setItems(updated)
    saveSection('experience', updated)
    close()
  }

  function remove(id: string) {
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    saveSection('experience', updated)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{items.length} entries</p>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={15} /> Add Experience
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-medium">{item.position}</p>
              <p className="text-violet-400 text-sm">{item.company}</p>
              <p className="text-white/30 text-xs mt-1">{item.startDate} — {item.current ? 'Present' : item.endDate}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(item)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <Edit3 size={14} />
              </button>
              <button onClick={() => remove(item.id)}
                className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal title={isNew ? 'Add Experience' : 'Edit Experience'} onClose={close} onSave={save} saving={saving}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Position">
                  <input className="input-field" value={editing.position}
                    onChange={e => setEditing({ ...editing, position: e.target.value })} />
                </Field>
                <Field label="Company">
                  <input className="input-field" value={editing.company}
                    onChange={e => setEditing({ ...editing, company: e.target.value })} />
                </Field>
                <Field label="Start Date (YYYY-MM)">
                  <input className="input-field" placeholder="2022-03" value={editing.startDate}
                    onChange={e => setEditing({ ...editing, startDate: e.target.value })} />
                </Field>
                <Field label="End Date (or leave blank)">
                  <input className="input-field" placeholder="2024-01" value={editing.endDate}
                    disabled={editing.current}
                    onChange={e => setEditing({ ...editing, endDate: e.target.value })} />
                </Field>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setEditing({ ...editing, current: !editing.current })}
                  className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center px-0.5
                    ${editing.current ? 'bg-violet-600' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300
                    ${editing.current ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-white/60 text-sm">Currently working here</span>
              </label>
              <Field label="Description">
                <textarea className="input-field resize-none h-24" value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </Field>
              <Field label="Technologies (comma-separated)">
                <input className="input-field" value={editing.technologies.join(', ')}
                  onChange={e => setEditing({ ...editing, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </Field>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── EDUCATION TAB ───
function EducationTab({ data, saveSection, saving }: TabProps) {
  const [items, setItems] = useState<Education[]>(data.education)
  const [editing, setEditing] = useState<Education | null>(null)
  const [isNew, setIsNew] = useState(false)

  const empty: Education = { id: '', institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' }

  function openNew() { setEditing({ ...empty, id: genId() }); setIsNew(true) }
  function openEdit(item: Education) { setEditing({ ...item }); setIsNew(false) }
  function close() { setEditing(null) }

  function save() {
    if (!editing) return
    const updated = isNew ? [...items, editing] : items.map(i => i.id === editing.id ? editing : i)
    setItems(updated)
    saveSection('education', updated)
    close()
  }

  function remove(id: string) {
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    saveSection('education', updated)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{items.length} entries</p>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={15} /> Add Education
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-medium">{item.degree} in {item.field}</p>
              <p className="text-violet-400 text-sm">{item.institution}</p>
              <p className="text-white/30 text-xs mt-1">{item.startDate} — {item.endDate}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"><Edit3 size={14} /></button>
              <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal title={isNew ? 'Add Education' : 'Edit Education'} onClose={close} onSave={save} saving={saving}>
            <div className="space-y-4">
              <Field label="Institution">
                <input className="input-field" value={editing.institution} onChange={e => setEditing({ ...editing, institution: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Degree">
                  <input className="input-field" placeholder="Bachelor of Science" value={editing.degree} onChange={e => setEditing({ ...editing, degree: e.target.value })} />
                </Field>
                <Field label="Field of Study">
                  <input className="input-field" placeholder="Computer Science" value={editing.field} onChange={e => setEditing({ ...editing, field: e.target.value })} />
                </Field>
                <Field label="Start Date (YYYY-MM)">
                  <input className="input-field" value={editing.startDate} onChange={e => setEditing({ ...editing, startDate: e.target.value })} />
                </Field>
                <Field label="End Date (YYYY-MM)">
                  <input className="input-field" value={editing.endDate} onChange={e => setEditing({ ...editing, endDate: e.target.value })} />
                </Field>
              </div>
              <Field label="Description">
                <textarea className="input-field resize-none h-24" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </Field>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── PROJECTS TAB ───
function ProjectsTab({ data, saveSection, saving }: TabProps) {
  const [items, setItems] = useState<Project[]>(data.projects)
  const [editing, setEditing] = useState<Project | null>(null)
  const [isNew, setIsNew] = useState(false)

  const empty: Project = { id: '', name: '', description: '', technologies: [], github: '', demo: '', image: '' }

  function openNew() { setEditing({ ...empty, id: genId() }); setIsNew(true) }
  function openEdit(item: Project) { setEditing({ ...item, technologies: [...item.technologies] }); setIsNew(false) }
  function close() { setEditing(null) }

  function save() {
    if (!editing) return
    const updated = isNew ? [...items, editing] : items.map(i => i.id === editing.id ? editing : i)
    setItems(updated)
    saveSection('projects', updated)
    close()
  }

  function remove(id: string) {
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    saveSection('projects', updated)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{items.length} projects</p>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={15} /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">{item.name}</p>
              <p className="text-white/40 text-sm truncate mt-0.5">{item.description}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"><Edit3 size={14} /></button>
              <button onClick={() => remove(item.id)} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <Modal title={isNew ? 'Add Project' : 'Edit Project'} onClose={close} onSave={save} saving={saving}>
            <div className="space-y-4">
              <Field label="Project Name">
                <input className="input-field" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Description">
                <textarea className="input-field resize-none h-20" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </Field>
              <Field label="Technologies (comma-separated)">
                <input className="input-field" value={editing.technologies.join(', ')}
                  onChange={e => setEditing({ ...editing, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="GitHub URL">
                  <input className="input-field" type="url" value={editing.github} onChange={e => setEditing({ ...editing, github: e.target.value })} />
                </Field>
                <Field label="Demo URL">
                  <input className="input-field" type="url" value={editing.demo} onChange={e => setEditing({ ...editing, demo: e.target.value })} />
                </Field>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── MEDIA TAB ───
function MediaTab({ data, headers, refetch }: TabProps) {
  const photoRef = useRef<HTMLInputElement>(null)
  const cvRef = useRef<HTMLInputElement>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingCv, setUploadingCv] = useState(false)
  const token = headers.Authorization.replace('Bearer ', '')

  async function uploadPhoto(file: File) {
    setUploadingPhoto(true)
    const fd = new FormData()
    fd.append('photo', file)
    try {
      await axios.post('/api/upload/photo', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Photo uploaded!')
      refetch()
      setPhotoPreview(null)
    } catch {
      toast.error('Failed to upload photo')
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function uploadCv(file: File) {
    setUploadingCv(true)
    const fd = new FormData()
    fd.append('cv', file)
    try {
      await axios.post('/api/upload/cv', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      toast.success('CV uploaded!')
      refetch()
    } catch {
      toast.error('Failed to upload CV')
    } finally {
      setUploadingCv(false)
    }
  }

  async function removePhoto() {
    try {
      await axios.delete('/api/upload/photo', { headers })
      toast.success('Photo removed')
      refetch()
    } catch { toast.error('Failed') }
  }

  async function removeCv() {
    try {
      await axios.delete('/api/upload/cv', { headers })
      toast.success('CV removed')
      refetch()
    } catch { toast.error('Failed') }
  }

  const currentPhoto = data.photoBase64
    ? `data:${data.photoMimeType || 'image/jpeg'};base64,${data.photoBase64}`
    : null

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Photo */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Image size={18} className="text-violet-400" /> Profile Photo
        </h3>

        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden border-2 border-violet-500/30 bg-violet-900/20 flex items-center justify-center">
            {(photoPreview || currentPhoto) ? (
              <img src={photoPreview || currentPhoto!} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-white/20" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-white/40 text-sm">JPEG, PNG, or WEBP. Max 5 MB.</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => photoRef.current?.click()}
                disabled={uploadingPhoto}
                className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
              >
                {uploadingPhoto ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
                Upload Photo
              </button>
              {(currentPhoto || photoPreview) && (
                <button onClick={removePhoto} className="btn-outline text-sm py-2 px-4 flex items-center gap-2 text-red-400/70 hover:text-red-400">
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>
            <input
              ref={photoRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onloadend = () => setPhotoPreview(reader.result as string)
                reader.readAsDataURL(file)
                uploadPhoto(file)
                e.target.value = ''
              }}
            />
          </div>
        </div>
      </div>

      {/* CV Upload */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={18} className="text-violet-400" /> Curriculum Vitae (CV)
        </h3>

        <div className="space-y-4">
          {data.cvFileName ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <FileText size={20} className="text-violet-400 flex-shrink-0" />
              <span className="text-white/70 text-sm flex-1 truncate">{data.cvFileName}</span>
              <a href="/api/upload/cv" download className="text-xs text-violet-400 hover:text-violet-300 flex-shrink-0">Download</a>
            </div>
          ) : (
            <p className="text-white/30 text-sm">No CV uploaded yet.</p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => cvRef.current?.click()}
              disabled={uploadingCv}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
            >
              {uploadingCv ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
              {data.cvFileName ? 'Replace CV' : 'Upload CV'}
            </button>
            {data.cvFileName && (
              <button onClick={removeCv} className="btn-outline text-sm py-2 px-4 flex items-center gap-2 text-red-400/70 hover:text-red-400">
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>

          <input
            ref={cvRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              uploadCv(file)
              e.target.value = ''
            }}
          />
          <p className="text-white/30 text-xs">PDF only. Max 10 MB.</p>
        </div>
      </div>
    </div>
  )
}

// ─────────── Reusable Components ───────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  )
}

function Modal({ title, onClose, onSave, saving, children }: {
  title: string
  onClose: () => void
  onSave: () => void
  saving: boolean
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg glass-card p-6 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>
        {children}
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="btn-outline text-sm py-2 px-5">Cancel</button>
          <button onClick={onSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm py-2 px-5">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
