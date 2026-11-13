import { useEffect, useMemo, useState } from 'react'
import { FileText, Search, BriefcaseBusiness, Sparkles, Upload, ArrowUpRight, MapPin, Building2, Clock3, X, Plus, Trash2, LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react'

const sampleResume = `Java developer with 2 years of experience building REST APIs using Java, Spring Boot, JPA and PostgreSQL. Familiar with React, JavaScript, Docker, Git, unit testing and CI/CD. Built scalable backend services and collaborated with frontend teams.`

async function api(path, options = {}) {
  const response = await fetch(path, options)
  if (!response.ok) {
    let message = 'Request failed ($response.status})'
    try { const body = await response.json(); message = body.message || body.error || message } catch {}
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export default function App() {
  const [jobs, setJobs] = useState([])
  const [resumeText, setResumeText] = useState('')
  const [file, setFile] = useState(null)
  const [results, setResults] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [activeTab, setActiveTab] = useState('match')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({title:'',company:'',location:'Remote',employmentType:'Full-time',requiredSkills:'',description:''})

  const loadJobs = async () => { try { setJobs(await api('/api/jobs')) } catch (e) { setError(e.message) } }
  useEffect(() => { loadJobs() }, [])
  const filteredJobs = useMemo(() => jobs.filter(j => `${j.title} ${j.company} ${j.requiredSkills} ${j.description}`.toLowerCase().includes(search.toLowerCase())), [jobs, search])

  const runMatch = async (e) => {
    e?.preventDefault()
    setError(''); setNotice(''); setLoading(true)
    try {
      let text = resumeText.trim()
      if (file) {
        const data = new FormData(); data.append('file', file)
        const parsed = await api('/api/resumes/analyze', { method: 'POST', body: data })
        text = parsed.text; setResumeText(text); setAnalysis(parsed)
      }
      if (!text) throw new Error('Paste your resume text or upload a resume first.')
      const parsed = await api('/api/resumes/analyze', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({resumeText:text}) })
      setAnalysis(parsed)
      const matches = await api('/api/matches',
