'use client'

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Category = 'idea' | 'task' | 'feature' | 'bug' | 'note'
type Filter   = 'all' | 'active' | 'done'

interface Todo {
  id: number
  text: string
  category: Category
  completed: boolean
  created_at: string
}

const CAT_COLORS: Record<Category, { bg: string; color: string; label: string }> = {
  idea:    { bg: '#EEF3F8', color: '#1F3A5F', label: 'Idea' },
  task:    { bg: 'var(--beige)', color: 'var(--brown)', label: 'Task' },
  feature: { bg: '#F0EBE3', color: '#7A5020', label: 'Feature' },
  bug:     { bg: '#F5DDD5', color: '#8A3A20', label: 'Bug' },
  note:    { bg: '#F5EFE6', color: 'var(--tan)', label: 'Note' },
}

const CATEGORIES: Category[] = ['task', 'idea', 'feature', 'bug', 'note']

const inp: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px', fontWeight: 300, outline: 'none',
}

export default function TodosPage() {
  const [todos, setTodos]     = useState<Todo[]>([])
  const [text, setText]       = useState('')
  const [category, setCategory] = useState<Category>('task')
  const [filter, setFilter]   = useState<Filter>('active')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('todos').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setTodos((data ?? []) as Todo[]); setLoading(false) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    const { data } = await supabase.from('todos').insert({ text: text.trim(), category }).select().single()
    if (data) setTodos(prev => [data as Todo, ...prev])
    setText('')
    setSaving(false)
  }

  async function toggle(id: number, completed: boolean) {
    await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
  }

  async function remove(id: number) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t =>
    filter === 'all'    ? true :
    filter === 'active' ? !t.completed :
    t.completed
  )

  const active = todos.filter(t => !t.completed).length
  const done   = todos.filter(t =>  t.completed).length

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
        To-do
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
        {active} active · {done} done
      </p>

      {/* Add form */}
      <form onSubmit={add} style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <input
          style={{ ...inp, flex: 1, minWidth: '200px' }}
          placeholder="Add a task, idea, or note…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <select
          style={{ ...inp, width: '120px' }}
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{CAT_COLORS[c].label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving || !text.trim()}
          style={{
            background: 'var(--dark-blue)', color: 'var(--cream)',
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500,
            padding: '10px 22px', borderRadius: '99px', border: 'none',
            cursor: saving || !text.trim() ? 'default' : 'pointer',
            opacity: saving || !text.trim() ? 0.5 : 1,
          }}
        >
          {saving ? '…' : '+ Add'}
        </button>
      </form>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {(['active', 'all', 'done'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px',
            fontWeight: filter === f ? 500 : 300,
            padding: '7px 16px', borderRadius: '99px', cursor: 'pointer',
            background: filter === f ? 'var(--dark-brown)' : 'transparent',
            color: filter === f ? 'var(--cream)' : 'var(--brown)',
            border: `0.5px solid ${filter === f ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
            textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'var(--tan)' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', padding: '40px 0', textAlign: 'center' }}>
          {filter === 'done' ? 'Nothing completed yet.' : 'All clear!'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(t => {
            const cat = CAT_COLORS[t.category] ?? CAT_COLORS.task
            return (
              <div
                key={t.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'white', borderRadius: '12px', padding: '14px 16px',
                  border: '0.5px solid rgba(122,92,69,0.1)',
                  opacity: t.completed ? 0.6 : 1, transition: 'opacity 0.2s',
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggle(t.id, t.completed)}
                  style={{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                    border: `1.5px solid ${t.completed ? 'var(--dark-blue)' : 'rgba(122,92,69,0.3)'}`,
                    background: t.completed ? 'var(--dark-blue)' : 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '11px', padding: 0,
                  }}
                >
                  {t.completed ? '✓' : ''}
                </button>

                {/* Text */}
                <span style={{
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300,
                  color: 'var(--dark-brown)', flex: 1, lineHeight: 1.5,
                  textDecoration: t.completed ? 'line-through' : 'none',
                }}>
                  {t.text}
                </span>

                {/* Category badge */}
                <span style={{
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500,
                  padding: '3px 9px', borderRadius: '99px', letterSpacing: '0.04em',
                  background: cat.bg, color: cat.color, flexShrink: 0,
                }}>
                  {cat.label}
                </span>

                {/* Delete */}
                <button
                  onClick={() => remove(t.id)}
                  style={{
                    fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px',
                    color: 'var(--tan)', background: 'none', border: 'none',
                    cursor: 'pointer', padding: '0 4px', lineHeight: 1, flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Clear done */}
      {done > 0 && filter !== 'active' && (
        <button
          onClick={async () => {
            await supabase.from('todos').delete().eq('completed', true)
            setTodos(prev => prev.filter(t => !t.completed))
          }}
          style={{
            marginTop: '24px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px',
            fontWeight: 300, color: 'var(--tan)', background: 'none', border: 'none',
            cursor: 'pointer', padding: 0, textDecoration: 'underline',
          }}
        >
          Clear all done ({done})
        </button>
      )}
    </div>
  )
}
