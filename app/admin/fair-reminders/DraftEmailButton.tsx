'use client'

import { GmailDraftButton } from '@/components/dashboard/GmailDraftButton'

function fmtDate(d: string, locale = 'en-US') {
  return new Date(d).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })
}

function buildEmail(lang: string, fairName: string, fairDate: string, fairDeadline: string | null) {
  switch (lang) {
    case 'ja': {
      const date     = fmtDate(fairDate, 'ja-JP')
      const deadline = fairDeadline ? fmtDate(fairDeadline, 'ja-JP') : null
      return {
        subject: `${fairName}が開催されます — Studio2Jで注文する`,
        body: `こんにちは、

Studio2Jのフェアトラッカーで${fairName}を保存いただきありがとうございます。

日程：${date}${deadline ? `\n注文締め切り：${deadline}` : ''}

${fairName}に参加する予定です！締め切りまでにご注文いただければ、現地でアイテムをお受け取りし、お届けします。

注文はこちら：https://studio2j.pages.dev/order/new

ご質問はInstagramで @studio2j25 までDMをお送りください。`,
      }
    }
    case 'zh-TW': {
      const date     = fmtDate(fairDate, 'zh-TW')
      const deadline = fairDeadline ? fmtDate(fairDeadline, 'zh-TW') : null
      return {
        subject: `${fairName} 即將開始 — 透過 Studio2J 下單`,
        body: `您好，

感謝您在 Studio2J 展覽追蹤器上儲存了 ${fairName}。

日期：${date}${deadline ? `\n下單截止：${deadline}` : ''}

我們將親赴 ${fairName}！請在截止日期前下單，我們將在現場為您採購並寄送。

立即下單：https://studio2j.pages.dev/order/new

有任何問題，歡迎在 Instagram 私訊 @studio2j25。`,
      }
    }
    default: {
      const date     = fmtDate(fairDate)
      const deadline = fairDeadline ? fmtDate(fairDeadline) : null
      return {
        subject: `${fairName} is coming up — order with Studio2J`,
        body: `Dear there,

You saved ${fairName} on Studio2J's fair tracker.

Date: ${date}${deadline ? `\nOrder deadline: ${deadline}` : ''}

We will be picking up items at the fair! If you would like us to get something for you, please place your order before the deadline.

Place an order: https://studio2j.pages.dev/order/new

Questions? DM us @studio2j25 on Instagram or reply to this email.`,
      }
    }
  }
}

export function DraftEmailButton({ fairName, fairDate, fairDeadline, emails, lang = 'en', label = 'Draft email' }: {
  fairName: string
  fairDate: string
  fairDeadline: string | null
  emails: string[]
  lang?: string
  label?: string
}) {
  const { subject, body } = buildEmail(lang, fairName, fairDate, fairDeadline)

  return (
    <GmailDraftButton
      bcc={emails.join(', ')}
      subject={subject}
      body={body}
      label={label}
    />
  )
}
