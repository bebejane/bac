import s from './Hamburger.module.scss'
import cn from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import useStore from '/lib/store'
import { useTranslations } from 'next-intl'

export default function Hamburger() {

  const t = useTranslations('Menu')
  const [showMenu, setShowMenu] = useStore((state) => [state.showMenu, state.setShowMenu])

  const handleClick = (e) => {
    setShowMenu(!showMenu)
    e.stopPropagation();
  }

  return (
    <div className={s.hamburger} onClick={handleClick}>
      <strong>
        {!showMenu ? t('menu') : t('close')}
      </strong>
    </div>
  )
}
