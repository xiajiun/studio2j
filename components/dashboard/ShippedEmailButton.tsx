'use client'

import { GmailDraftButton } from './GmailDraftButton'

function trackingUrl(num: string): string {
  const upper = num.toUpperCase()
  if (upper.endsWith('KR')) return `https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=${num}`
  if (upper.endsWith('JP')) return `https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=${num}`
  return `https://www.17track.net/en/track#nums=${num}`
}

function carrier(num: string): string {
  const upper = num.toUpperCase()
  if (upper.endsWith('KR')) return 'Korea Post EMS'
  if (upper.endsWith('JP')) return 'Japan Post EMS'
  return 'International courier'
}

export function ShippedEmailButton({ customerEmail, customerName, orderNumber, trackingNumber }: {
  customerEmail: string
  customerName: string | null
  orderNumber: string
  trackingNumber?: string | null
}) {
  const name = customerName ?? 'there'
  const trackingSection = trackingNumber ? `Tracking Information

Courier: ${carrier(trackingNumber)}
Tracking Number: ${trackingNumber}
Track Here: ${trackingUrl(trackingNumber)}

What to expect: International shipping typically takes 7–14 business days. Please keep an eye on your tracking link for the most up-to-date status. Once the package arrives in your country, your local postal service will handle the final delivery.

` : `We will share your tracking number with you as soon as it is available.

`

  const body = `Dear ${name},

Great news! We have successfully packed your stationery goodies and they are officially on their way to you.

We had so much fun curating these pieces for you. Everything has been inspected and packed with extra care to ensure it arrives safely.

${trackingSection}Share the Joy: We would love to see your haul! When your package arrives, please tag us @studio2j25 in your unboxing stories or posts. Seeing our stationery find a new home makes our day!

Thank you for trusting us with your journaling journey.

Questions? DM us @studio2j25 on Instagram or reply to this email.`

  return (
    <GmailDraftButton
      to={customerEmail}
      subject={`Your Studio2J order ${orderNumber} is on its way!`}
      body={body}
      label="Shipped email"
    />
  )
}
