'use client'

export const runtime = 'edge'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type Category = 'task' | 'idea' | 'feature' | 'bug' | 'note'
type CatTab   = 'tasks' | 'other'

interface Todo {
  id: number
  text: string
  category: Category
  completed: boolean
  order_index: number
  created_at: string
}

const CAT: Record<Category, { bg: string; color: string; label: string }> = {
  task:    { bg: 'var(--beige)',  color: 'var(--brown)', label: 'Task' },
  idea:    { bg: '#EEF3F8',       color: '#1F3A5F',      label: 'Idea' },
  feature: { bg: '#F0EBE3',       color: '#7A5020',      label: 'Feature' },
  bug:     { bg: '#F5DDD5',       color: '#8A3A20',      label: 'Bug' },
  note:    { bg: '#F5EFE6',       color: 'var(--tan)',   label: 'Note' },
}
const CATS: Category[] = ['task', 'idea', 'feature', 'bug', 'note']

const inp: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px', fontWeight: 300, outline: 'none',
}

function fmtDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    ...(date.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {}),
  })
}

// ── TodoItem defined OUTSIDE parent so React never remounts it on state change ──
interface TodoItemProps {
  t: Todo
  editingId: number | null
  editText: string
  editCat: Category
  editRef: React.RefObject<HTMLInputElement>
  onToggle: (id: number, completed: boolean) => void
  onRemove: (id: number) => void
  onStartEdit: (t: Todo) => void
  onSaveEdit: (id: number) => void
  onEditText: (v: string) => void
  onEditCat: (v: Category) => void
  onKey: (e: React.KeyboardEvent, id: number) => void
  // drag
  dragging: number | null
  onDragStart: (e: React.DragEvent, id: number) => void
  onDragOver: (e: React.DragEvent, id: number) => void
  onDrop: (e: React.DragEvent) => void
}

function TodoItem({ t, editingId, editText, editCat, editRef,
  onToggle, onRemove, onStartEdit, onSaveEdit, onEditText, onEditCat, onKey,
  dragging, onDragStart, onDragOver, onDrop }: TodoItemProps) {
  const cat     = CAT[t.category] ?? CAT.task
  const editing = editingId === t.id
  const isDragging = dragging === t.id

  return (
    <div
      draggable={!editing && !t.completed}
      onDragStart={e => onDragStart(e, t.id)}
      onDragOver={e => onDragOver(e, t.id)}
      onDrop={onDrop}
      style={{
        display: 'flex', flexDirection: 'column', gap: '6px',
        background: 'white', borderRadius: '12px', padding: '12px 14px',
        border: editing ? '0.5px solid var(--dark-blue)' : '0.5px solid rgba(122,92,69,0.1)',
        opacity: (t.completed && !editing) ? 0.65 : isDragging ? 0.4 : 1,
        transition: 'all 0.15s',
        cursor: editing || t.completed ? 'default' : 'grab',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => { if (!editing) onToggle(t.id, t.completed) }} style={{
          width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
          border: `1.5px solid ${t.completed ? 'var(--dark-blue)' : 'rgba(122,92,69,0.3)'}`,
          background: t.completed ? 'var(--dark-blue)' : 'white',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '10px', padding: 0,
        }}>{t.completed ? '✓' : ''}</button>

        {editing ? (
          <input
            ref={editRef}
            style={{ ...inp, flex: 1, padding: '4px 8px', fontSize: '13px' }}
            value={editText}
            onChange={e => onEditText(e.target.value)}
            onBlur={() => onSaveEdit(t.id)}
            onKeyDown={e => onKey(e, t.id)}
          />
        ) : (
          <span
            onClick={() => onStartEdit(t)}
            style={{
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
              color: 'var(--dark-brown)', flex: 1, lineHeight: 1.5, cursor: 'text',
              textDecoration: t.completed ? 'line-through' : 'none',
            }}
          >{t.text}</span>
        )}

        {editing ? (
          <button onClick={() => onSaveEdit(t.id)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--dark-blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', flexShrink: 0 }}>Save</button>
        ) : (
          <button onClick={() => onRemove(t.id)} style={{ fontSize: '15px', color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1, flexShrink: 0 }}>×</button>
        )}
      </div>

      {/* Bottom row — category + date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '28px' }}>
        {editing ? (
          <select style={{ ...inp, padding: '3px 8px', fontSize: '11px', width: '100px' }}
            value={editCat} onChange={e => onEditCat(e.target.value as Category)}>
            {CATS.map(c => <option key={c} value={c}>{CAT[c].label}</option>)}
          </select>
        ) : (
          <span onClick={() => onStartEdit(t)} style={{
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

// ── Main page ──
export default function TodosPage() {
  const [todos, setTodos]           = useState<Todo[]>([])
  const [text, setText]             = useState('')
  const [category, setCategory]     = useState<Category>('task')
  const [catTab, setCatTab]         = useState<CatTab>('tasks')
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [editingId, setEditingId]   = useState<number | null>(null)
  const [editText, setEditText]     = useState('')
  const [editCat, setEditCat]       = useState<Category>('task')
  const [dragging, setDragging]     = useState<number | null>(null)
  const [dragOver, setDragOver]     = useState<number | null>(null)
  const editRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('todos').select('*').order('order_index').order('created_at', { ascending: false })
      .then(({ data }) => { setTodos((data ?? []) as Todo[]); setLoading(false) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (editingId !== null) editRef.current?.focus() }, [editingId])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    const { data, error } = await supabase.from('todos')
      .insert({ text: text.trim(), category, order_index: 0 }).select().single()
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

  // Drag and drop
  function onDragStart(e: React.DragEvent, id: number) {
    setDragging(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e: React.DragEvent, id: number) {
    e.preventDefault()
    setDragOver(id)
  }

  async function onDrop(e: React.DragEvent) {
    e.preventDefault()
    if (dragging === null || dragOver === null || dragging === dragOver) {
      setDragging(null); setDragOver(null); return
    }
    const active = todos.filter(t => !t.completed)
    const fromIdx = active.findIndex(t => t.id === dragging)
    const toIdx   = active.findIndex(t => t.id === dragOver)
    if (fromIdx === -1 || toIdx === -1) { setDragging(null); setDragOver(null); return }

    const reordered = [...active]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)

    // Merge back with completed todos
    const completed = todos.filter(t => t.completed)
    const merged    = [...reordered, ...completed]
    setTodos(merged)

    // Persist order
    await Promise.all(reordered.map((t, i) =>
      supabase.from('todos').update({ order_index: i }).eq('id', t.id)
    ))
    setDragging(null); setDragOver(null)
  }

  // Filter by category tab
  const isTask  = (t: Todo) => t.category === 'task'
  const isOther = (t: Todo) => t.category !== 'task'
  const catFilter = catTab === 'tasks' ? isTask : isOther

  const active = todos.filter(t => !t.completed && catFilter(t))
  const done   = todos.filter(t =>  t.completed && catFilter(t))
  const totalActive = todos.filter(t => !t.completed).length

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500,
    letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)',
    marginBottom: '12px', paddingBottom: '8px', borderBottom: '0.5px solid rgba(122,92,69,0.1)',
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
        To-do
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '28px' }}>
        {totalActive} active
      </p>

      {/* Add form */}
      <form onSubmit={add} style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
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

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {([['tasks', 'Tasks'], ['other', 'Ideas & more']] as [CatTab, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setCatTab(k)} style={{
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px',
            fontWeight: catTab === k ? 500 : 300,
            padding: '7px 18px', borderRadius: '99px', cursor: 'pointer',
            background: catTab === k ? 'var(--dark-brown)' : 'transparent',
            color: catTab === k ? 'var(--cream)' : 'var(--brown)',
            border: `0.5px solid ${catTab === k ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
          }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'var(--tan)' }}>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Left — Active */}
          <div>
            <div style={sectionLabel}>Active · {active.length}</div>
            {active.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '15px', color: 'var(--tan)', padding: '20px 0' }}>All clear!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {active.map(t => (
                  <TodoItem key={t.id} t={t}
                    editingId={editingId} editText={editText} editCat={editCat} editRef={editRef}
                    onToggle={toggle} onRemove={remove} onStartEdit={startEdit}
                    onSaveEdit={saveEdit} onEditText={setEditText} onEditCat={setEditCat} onKey={onKey}
                    dragging={dragging} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right — Done */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...sectionLabel }}>
              <span>Done · {done.length}</span>
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
                {done.map(t => (
                  <TodoItem key={t.id} t={t}
                    editingId={editingId} editText={editText} editCat={editCat} editRef={editRef}
                    onToggle={toggle} onRemove={remove} onStartEdit={startEdit}
                    onSaveEdit={saveEdit} onEditText={setEditText} onEditCat={setEditCat} onKey={onKey}
                    dragging={dragging} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
