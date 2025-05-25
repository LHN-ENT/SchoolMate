import { useEffect, useState } from 'react'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  const [showSetup, setShowSetup] = useState(false)
  useEffect(()=>{
    // stub: determine if onboarding completed
    setShowSetup(false)
  },[])
  return <Dashboard hideSetup={!showSetup}/>
}
