import s from './Thumbnail.module.scss'
import cn from 'classnames'
import React, { useState } from 'react'
import { Image } from 'react-datocms/image'
import Link from '/components/nav/Link'
import { randomInt } from '/lib/utils'

export type Props = {
  image?: ImageFileField
  slug: string
  title: string
  subtitle?: string
  typeTitle?: string
  translate?: boolean
  typeFont?: string
}

export default function Thumbnail({ image, slug, title, subtitle, typeTitle, typeFont, translate = true }: Props) {

  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={slug} translate={translate} className={s.thumbnail}>
      {typeTitle &&
        <h2 className={s.typeTitle} style={{ fontFamily: typeFont ?? `Logo1` }}>
          {typeTitle}
        </h2>
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
      <h3 className={cn(!image && s.noimage)}><span><div>› </div></span>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </Link>
  )
}