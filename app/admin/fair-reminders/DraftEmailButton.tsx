'use client'

import { GmailDraftButton } from '@/components/dashboard/GmailDraftButton'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function DraftEmailButton({ fairName, fairDate, fairDeadline, emails }: {
  fairName: string
  fairDate: string
  fairDeadline: string | null
  emails: string[]
}) {
  const subject = `${fairName} is coming up — order with Studio2J`
  const body = `Dear there,

You saved ${fairName} on Studio2J's fair tracker.

Date: ${fmtDate(fairDate)}${fairDeadline ? `\nOrder deadline: ${fmtDate(fairDeadline)}` : ''}

We will be picking up items at the fair! If you would like us to get something for you, please place your order before the deadline.

Place an order: https://studio2j.pages.dev/order/new

Questions? DM us @studio2j25 on Instagram or reply to this email.`

  return (
    <GmailDraftButton
      bcc={emails.join(', ')}
      subject={subject}
      body={body}
      label="Draft email"
    />
  )
}
