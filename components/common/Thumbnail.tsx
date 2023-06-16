import s from './Thumbnail.module.scss'
import cn from 'classnames'
import React, { useState } from 'react'
import { Image } from 'react-datocms/image'
import Link from '/components/nav/Link'
import { truncateWords } from '/lib/utils'

export type Props = {
  image?: ImageFileField
  slug: string
  title: string
  subtitle?: string
  year?: number
  transformHref?: boolean
}

export default function Thumbnail({ image, slug, title, subtitle, year, transformHref = true }: Props) {

  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={slug} transformHref={transformHref} className={s.thumbnail}>
      {year && <h2 className={s.year}>{year}</h2>}
      {image &&
        <figure className={s.figure}>
          <>
            <Image
              data={image.responsiveImage}
              className={s.image}
              pictureClassName={s.picture}
              onLoad={() => setLoaded(true)}
            />
          </>
          <div className={s.cover}></div>
        </figure>
      }
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </Link>
  )
}