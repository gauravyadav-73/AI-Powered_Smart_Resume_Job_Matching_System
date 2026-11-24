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
      const matches = await api('/api/matches', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({resumeText:text,topK:10}) })
      setResults(matches); setActiveTab('match'); setNotice(`Analysis complete — ranked ${matches.length} jobs.`)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  
  const createJob = async (e) => {
    e.preventDefault(); setError(''); setNotice('')
    try {
      await api('/api/jobs', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      setForm({title:'',company:'',location:'Remote',employmentType:'Full-time',requiredSkills:'',description:''})
      setShowAdd(false); await loadJobs(); setNotice('Job published successfully.')
    } catch(e) { setError(e.message) }
  }
  const deleteJob = async (id) => {
    if (!confirm('Delete this job posting?')) return
    try { await api(`/api/jobs/${id}`,{method:'DELETE'}); await loadJobs(); setResults(r=>r.filter(x=>x.job.id!==id)); setNotice('Job deleted.') } catch(e) { setError(e.message) }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={21}/></div><div><strong>CareerLens</strong><span>AI CAREER STUDIO</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className={`nav-item ${activeTab==='match'?'active':''}`} onClick={()=>setActiveTab('match')}><Search size={18}/> Resume matching</button>
      <button className={`nav-item ${activeTab==='jobs'?'active':''}`} onClick={()=>setActiveTab('jobs')}><BriefcaseBusiness size={18}/> Explore jobs <span className="nav-count">{jobs.length}</span></button>
      <div className="sidebar-bottom"><div className="mini-icon"><Sparkles size={17}/></div><div><b>Smarter career moves</b><p>Find opportunities that fit your skills.</p></div></div>
      <div className="sidebar-foot">BUILT FOR YOUR NEXT CHAPTER</div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{activeTab==='match'?'Resume matching':'Explore jobs'}</b></div><div className="status-pill"><span className="status-dot"></span> Matching engine ready</div></header>
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> AI-POWERED CAREER DISCOVERY</div><h1>Your next role<br/>starts <em>with your skills.</em></h1><p>Turn your resume into a clear path forward. Discover roles ranked by how closely your experience aligns with what employers need.</p>
          <div className="hero-stats"><div><strong>{jobs.length.toString().padStart(2,'0')}</strong><span>OPEN ROLES</span></div><i></i><div><strong>{results.length.toString().padStart(2,'0')}</strong><span>YOUR MATCHES</span></div><i></i><div><strong>TF-IDF</strong><span>AI METHOD</span></div></div>
        </div>
        <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="art-center"><FileText size={42}/></div><div className="float-card card-a"><span className="float-icon violet"><Sparkles size={15}/></span><div><b>Skills identified</b><small>Resume intelligence</small></div><CheckCircle2 size={17} className="green"/></div><div className="float-card card-b"><span className="float-icon mint"><BriefcaseBusiness size={15}/></span></div><div className="float-card card-b"><span className="float-icon mint"><BriefcaseBusiness size={15}/></span><div><b>Better-fit roles</b><small>Ranked for relevance</small></div></div><div className="art-dot dot-one"></div><div className="art-dot dot-two"></div></div>
      </section>

      {(error||notice) && <div className={`flash ${error?'error':''}`}><span>{error?<AlertCircle size={17}/>:<CheckCircle2 size={17}/>}</span>{error||notice}<button onClick={()=>{setError('');setNotice('')}}><X size={15}/></button></div>}

      <div className="content-grid">
        <section className="left-column">
          <div className="section-heading"><div><span className="step-label">STEP 01</span><h2>Start with your resume</h2><p>Upload a file or paste your resume content to find your best-fit roles.</p></div><div className="step-icon"><FileText size={21}/></div></div>
          <form className="resume-card" onSubmit={runMatch}>
            <label className="upload-zone"><input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e=>{setFile(e.target.files?.[0]||null);setError('')}}/><div className="upload-symbol"><Upload size={21}/></div><div className="upload-title">{file?file.name:'Drop your resume here'}</div><div className="upload-sub">{file?'Ready to parse · '+(file.size/1024).toFixed(0)+' KB':'or click to browse · PDF, DOCX, DOC, TXT'}</div><span className="browse-btn">{file?'Change file':'Browse files'}</span></label>
            <div className="or-divider"><span></span> OR PASTE RESUME TEXT <span></span></div>
            <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} placeholder="Paste your professional summary, skills, experience, and education here..." rows="7"/>
            <div className="resume-actions"><span className="privacy-note"><span className="tiny-lock">✓</span> Processed for matching only</span><button className="primary-btn" type="submit" disabled={loading}>{loading?<><LoaderCircle className="spin" size={17}/> Analyzing...</>:<><Sparkles size={16}/> Find my matches <ArrowUpRight size={16}/></>}</button></div>
            <button className="sample-btn" type="button" onClick={()=>{setResumeText(sampleResume);setFile(null);setError('')}}>Try with sample resume</button>
          </form>
          {analysis && <div className="analysis-card"><div className="analysis-top"><div><span className="step-label">RESUME INSIGHTS</span><h3>Profile snapshot</h3></div><span className="analysis-badge"><CheckCircle2 size={14}/> 
