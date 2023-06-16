import s from './FilterBar.module.scss'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export type FilterOption = {
  id: string
  label: string
}

export type Props = {
  options: FilterOption[],
  multi?: boolean,
  onChange: (value: string[] | string) => void
}

export default function FilterBar({ options = [], onChange, multi = false }: Props) {

  const t = useTranslations('FilterBar')
  const [selected, setSelected] = useState<FilterOption[]>([options[0]])

  useEffect(() => {
    onChange(multi ? selected.map(({ id }) => id) : selected[0]?.id)
  }, [selected])

  return (
    <nav className={s.filter}>
      <span>{t('sortBy')}:</span>
      {options.map((opt, idx) =>
        <span
          key={idx}
          onClick={() => setSelected(selected.find(({ id }) => id === opt.id) ? selected.filter(({ id }) => id !== opt.id) : multi ? [...selected, opt] : [opt])}
          className={cn(selected?.find(({ id }) => id === opt.id) && s.selected)}
        >
          {opt.label}
        </span>
      )}
    </nav>
  )
}

