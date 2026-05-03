'use client'

export const runtime = 'edge'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type Category = 'inbox' | 'idea' | 'task' | 'feature' | 'bug' | 'note'

interface Todo {
  id: number
  text: string
  category: Category
  completed: boolean
  created_at: string
}

const CAT: Record<Category, { bg: string; color: string; label: string }> = {
  inbox:   { bg: '#E8DFD1', color: '#4B372A', label: 'Inbox' },
  task:    { bg: 'var(--beige)', color: 'var(--brown)', label: 'Task' },
  idea:    { bg: '#EEF3F8', color: '#1F3A5F', label: 'Idea' },
  feature: { bg: '#F0EBE3', color: '#7A5020', label: 'Feature' },
  bug:     { bg: '#F5DDD5', color: '#8A3A20', label: 'Bug' },
  note:    { bg: '#F5EFE6', color: 'var(--tan)', label: 'Note' },
}
const CATS: Category[] = ['inbox', 'task', 'idea', 'feature', 'bug', 'note']

const inp: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px', fontWeight: 300, outline: 'none',
}

function fmtDate(d: string) {
  const date = new Date(d)
  const now  = new Date()
  const sameYear = date.getFullYear() === now.getFullYear()
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    ...(!sameYear ? { year: 'numeric' } : {}),
  })
}

export default function TodosPage() {
  const [todos, setTodos]           = useState<Todo[]>([])
  const [text, setText]             = useState('')
  const [category, setCategory]     = useState<Category>('inbox')
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [editText, setEditText]     = useState('')
  const [editCat, setEditCat]       = useState<Category>('inbox')
  const editRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('todos').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setTodos((data ?? []) as Todo[])
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editingId !== null) editRef.current?.focus()
  }, [editingId])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    const { data, error } = await supabase.from('todos').insert({ text: text.trim(), category }).select().single()
    if (!error && data) setTodos(prev => [data as Todo, ...prev])
    setText('')
    setSaving(false)
  }

  async function toggle(id: number, completed: boolean) {
    const { error } = await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    if (!error) setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
  }

  async function remove(id: number) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function startEdit(t: Todo) { setEditingId(t.id); setEditText(t.text); setEditCat(t.category) }

  async function saveEdit(id: number) {
    if (!editText.trim()) { setEditingId(null); return }
    const { error } = await supabase.from('todos').update({ text: editText.trim(), category: editCat }).eq('id', id)
    if (!error) setTodos(prev => prev.map(t => t.id === id ? { ...t, text: editText.trim(), category: editCat } : t))
    setEditingId(null)
  }

  function onKey(e: React.KeyboardEvent, id: number) {
    if (e.key === 'Enter') saveEdit(id)
    if (e.key === 'Escape') setEditingId(null)
  }

  const active = todos.filter(t => !t.completed)
  const done   = todos.filter(t =>  t.completed)

  function TodoItem({ t }: { t: Todo }) {
    const cat     = CAT[t.category] ?? CAT.inbox
    const editing = editingId === t.id
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '6px',
        background: 'white', borderRadius: '12px', padding: '12px 14px',
        border: editing ? '0.5px solid var(--dark-blue)' : '0.5px solid rgba(122,92,69,0.1)',
        opacity: t.completed && !editing ? 0.65 : 1, transition: 'all 0.15s',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => { if (!editing) toggle(t.id, t.completed) }} style={{
            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
            border: `1.5px solid ${t.completed ? 'var(--dark-blue)' : 'rgba(122,92,69,0.3)'}`,
            background: t.completed ? 'var(--dark-blue)' : 'white',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '10px', padding: 0,
          }}>{t.completed ? '✓' : ''}</button>

          {editing ? (
            <input ref={editRef} style={{ ...inp, flex: 1, padding: '4px 8px', fontSize: '13px' }}
              value={editText} onChange={e => setEditText(e.target.value)}
              onBlur={() => saveEdit(t.id)} onKeyDown={e => onKey(e, t.id)} />
          ) : (
            <span onClick={() => startEdit(t)} style={{
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
              color: 'var(--dark-brown)', flex: 1, lineHeight: 1.5, cursor: 'text',
              textDecoration: t.completed ? 'line-through' : 'none',
            }}>{t.text}</span>
          )}

          {editing ? (
            <button onClick={() => saveEdit(t.id)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--dark-blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}>Save</button>
          ) : (
            <button onClick={() => remove(t.id)} style={{ fontSize: '15px', color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1, flexShrink: 0 }}>×</button>
          )}
        </div>

        {/* Bottom row — category + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '28px' }}>
          {editing ? (
            <select style={{ ...inp, padding: '3px 8px', fontSize: '11px', width: '100px' }}
              value={editCat} onChange={e => setEditCat(e.target.value as Category)}>
              {CATS.map(c => <option key={c} value={c}>{CAT[c].label}</option>)}
            </select>
          ) : (
            <span onClick={() => startEdit(t)} style={{
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500,
              padding: '2px 8px', borderRadius: '99px', letterSpacing: '0.04em',
              background: cat.bg, color: cat.color, cursor: 'pointer',
            }}>{cat.label}</span>
          )}
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
            {fmtDate(t.created_at)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
        To-do
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '28px' }}>
        {active.length} active · {done.length} done
      </p>

      {/* Add form */}
      <form onSubmit={add} style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
        <input style={{ ...inp, flex: 1, minWidth: '200px' }}
          placeholder="Add a task, idea, or note…"
          value={text} onChange={e => setText(e.target.value)} />
        <select style={{ ...inp, width: '110px' }} value={category} onChange={e => setCategory(e.target.value as Category)}>
          {CATS.map(c => <option key={c} value={c}>{CAT[c].label}</option>)}
        </select>
        <button type="submit" disabled={saving || !text.trim()} style={{
          background: 'var(--dark-blue)', color: 'var(--cream)',
          fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500,
          padding: '10px 22px', borderRadius: '99px', border: 'none',
          cursor: saving || !text.trim() ? 'default' : 'pointer',
          opacity: saving || !text.trim() ? 0.5 : 1,
        }}>{saving ? '…' : '+ Add'}</button>
      </form>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'var(--tan)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Left — Active */}
          <div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
              Active · {active.length}
            </div>
            {active.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '15px', color: 'var(--tan)', padding: '20px 0' }}>All clear!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {active.map(t => <TodoItem key={t.id} t={t} />)}
              </div>
            )}
          </div>

          {/* Right — Done */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)' }}>
                Done · {done.length}
              </span>
              {done.length > 0 && (
                <button onClick={async () => {
                  await supabase.from('todos').delete().eq('completed', true)
                  setTodos(prev => prev.filter(t => !t.completed))
                }} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                  Clear all
                </button>
              )}
            </div>
            {done.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '15px', color: 'var(--tan)', padding: '20px 0' }}>Nothing done yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {done.map(t => <TodoItem key={t.id} t={t} />)}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
