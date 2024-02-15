import s from './NewsletterForm.module.scss'
import cn from 'classnames'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from 'next/router'

export type Props = {
  className?: string
}

export default function NewsletterForm({ }: Props) {

  const t = useTranslations('NewsletterForm')
  const { locale } = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const locale = formData.get('locale') as string

    fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ email, locale }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async (res) => {
      if (!res.ok) {
        const { message } = await res.json()
        throw new Error(message)
      } else {
        setSuccess(true)
      }
    }).catch((error) => {
      setError(error.message)
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className={s.newsletter}>
      <p>{t('subscribe')}</p>
      {success ?
        <p className={s.success}>{t('success')}</p>
        :
        <form className={cn(s.form, loading && s.loading)} onSubmit={handleSubmit}>
          <input type="hidden" name="locale" value={locale} />
          <input type="email" name="email" placeholder={`${t('email')}...`} /><br />
          <button type="submit">{t('submit')}</button>
        </form>
      }
      {error && <p className={s.error}>{error}</p>}
    </div>
  )
}