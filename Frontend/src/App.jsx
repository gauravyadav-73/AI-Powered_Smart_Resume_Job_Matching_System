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
