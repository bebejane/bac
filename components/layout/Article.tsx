import s from './Article.module.scss'
import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { StructuredContent } from "/components";
import { Image } from 'react-datocms';
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { DatoSEO } from 'dato-nextjs-utils/components';
import Link from '/components/nav/Link'
import useStore from '/lib/store';
import format from 'date-fns/format';
import { useTranslations } from 'next-intl';
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import useDevice from '/lib/hooks/useDevice';
import BalanceText from 'react-balance-text'

export type ArticleProps = {
  id: string
  children?: React.ReactNode | React.ReactNode[] | undefined
  aside?: React.ReactNode | React.ReactNode[] | undefined
  title?: string
  subtitle?: string
  intro?: string
  image?: ImageFileField
  video?: VideoField
  gallery?: ImageFileField[]
  imageSize?: 'small' | 'medium' | 'large'
  content?: any
  metaInfo?: MetaInfoRecord[]
  cv?: CvRecord[]
  onClick?: (id: string) => void
  record?: any
}

export default function Article({ id, children, title, subtitle, content, image, imageSize, intro, metaInfo, cv, video, onClick, record }: ArticleProps) {

  const t = useTranslations()
  const [setImageId, setImages] = useStore((state) => [state.setImageId, state.setImages])
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const captionRef = useRef<HTMLElement | null>(null)
  const figureRef = useRef<HTMLElement | null>(null)
  const [offset, setOffset] = useState(0)
  const { isDesktop } = useDevice()
  const ratio = !isDesktop ? 0 : offset ? Math.max(0, Math.min(1, ((scrolledPosition - (offset > viewportHeight ? offset - viewportHeight + 100 : 0)) / viewportHeight))) : 0

  useEffect(() => {
    const images = [image]
    content?.blocks.forEach(el => {
      el.__typename === 'ImageRecord' && images.push(el.image)
      el.__typename === 'ImageGalleryRecord' && images.push.apply(images, el.images)
    })
    setImages(images.filter(el => el))
  }, [])

  return (
    <>
      <DatoSEO title={title} />
      <div className={cn(s.article, 'article')}>
        <header><h1>{title}</h1></header>
        {image &&
          <figure
            className={cn(s.mainImage, imageSize && s[imageSize], image.height > image.width && s.portrait)}
            onClick={() => setImageId(image?.id)}
            ref={figureRef}
          >
            <Image
              data={image.responsiveImage}
              className={s.image}
              pictureClassName={s.picture}
            />
          </figure>
        }
        <div className={s.wrapper}>
          <section className={s.content}>
            {subtitle && <h3>{subtitle}</h3>}
            <Markdown className={s.intro}>{intro}</Markdown>
            {content &&
              <StructuredContent
                id={id}
                record={record}
                content={content}
                onClick={(imageId) => setImageId(imageId)}
              />
            }
            {cv?.map(({ headline, text }, idx) =>
              <React.Fragment key={idx}>
                <Markdown className={s.cv}>{`**${headline}** ${text}`}</Markdown>
              </React.Fragment>
            )}
            {children}
          </section>
          {metaInfo &&
            <aside>
              {image?.title &&
                <p>{image?.title}</p>
              }
              {metaInfo?.map(({ headline, text }, idx) =>
                <React.Fragment key={idx}>
                  <h3>{headline}</h3>
                  <Markdown>{text}</Markdown>
                </React.Fragment>
              )}
            </aside>
          }
        </div>
      </div>
    </>
  )
}