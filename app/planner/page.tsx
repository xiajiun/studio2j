export const runtime = 'edge'

import { redirect } from 'next/navigation'

// The old 2026 planner guide now lives at the 2027 planner catalogue
export default function PlannerPage() {
  redirect('/catalogue/planners-2027')
}
