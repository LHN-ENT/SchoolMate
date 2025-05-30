import { useState } from 'react'
export default function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const sendMessage = async () => {
    const res = await fetch('/api/openai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: input }),
    })
    const data = await res.json()
    setMessages([...messages, { user: input, bot: data.reply }])
    setInput('')
  }
  return (
    <div className="p-4">
      <div className="h-64 overflow-y-auto border rounded p-2 mb-2">
        {messages.map((m, i) => (
          <div key={i}>
            <b>You:</b> {m.user ?? ''}<br />
            <b>Bot:</b> {m.bot ?? ''}
          </div>
        ))}
      </div>
      <div className="flex">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-grow p-2 border rounded" />
        <button onClick={sendMessage} className="ml-2 px-4 bg-green-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}
