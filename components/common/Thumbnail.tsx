import s from './Thumbnail.module.scss'
import cn from 'classnames'
import React, { useState } from 'react'
import { Image } from 'react-datocms/image'
import Link from '/components/nav/Link'
import { truncateWords, randomInt } from '/lib/utils'

export type Props = {
  image?: ImageFileField
  slug: string
  title: string
  subtitle?: string
  typeTitle?: string
  transformHref?: boolean
}

export default function Thumbnail({ image, slug, title, subtitle, typeTitle, transformHref = true }: Props) {

  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={slug} transformHref={transformHref} className={s.thumbnail}>
      {typeTitle &&
        <h2
          className={s.typeTitle}
          style={{ fontFamily: `Logo${randomInt(1, 4)}` }}
        >{typeTitle}</h2>
      }
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