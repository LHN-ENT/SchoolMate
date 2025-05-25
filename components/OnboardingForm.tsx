import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'

type Child = { name: string }
export default function OnboardingForm() {
  const { data: session } = useSession()
  const [children, setChildren] = useState<Child[]>([{ name: '' }])
  const [transport, setTransport] = useState('bus')
  const [aftercare, setAftercare] = useState(false)
  const [dailyDigest, setDailyDigest] = useState(true)
  const addChild = () => setChildren([...children, { name: '' }])
  const updateChild = (i, name) => { const c=[...children]; c[i].name=name; setChildren(c) }
  const handleSubmit = e => { e.preventDefault(); console.log({ children, transport, aftercare, dailyDigest }) }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!session && <button type="button" onClick={()=>signIn('google')} className="w-full py-2 bg-red-500 text-white rounded">Sign in with Google</button>}
      <div><label className="block font-medium">Child Names</label>
        {children.map((c,i)=><input key={i} type="text" placeholder={`Child ${i+1}`} value={c.name} onChange={e=>updateChild(i,e.target.value)} className="mt-1 w-full p-2 border rounded"/>)}
        <button type="button" onClick={addChild} className="mt-2 text-blue-600">+ Add Child</button>
      </div>
      <div><label className="block font-medium">Transport</label>
        <select value={transport} onChange={e=>setTransport(e.target.value)} className="mt-1 w-full p-2 border rounded">
          <option value="bus">Bus</option><option value="drive">Drive</option><option value="walk">Walk</option>
        </select>
      </div>
      <div className="flex items-center">
        <input id="aftercare" type="checkbox" checked={aftercare} onChange={()=>setAftercare(!aftercare)} className="mr-2"/>
        <label htmlFor="aftercare">Require aftercare?</label>
      </div>
      <div className="flex items-center">
        <label className="font-medium mr-4">Daily Digest</label>
        <input type="checkbox" checked={dailyDigest} onChange={()=>setDailyDigest(!dailyDigest)}/>
      </div>
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Continue</button>
    </form>
  )
}
