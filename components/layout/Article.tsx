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
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, EffectCards, Navigation } from 'swiper'
import SwiperCore from 'swiper'
import type { Swiper as SwiperType } from 'swiper'

SwiperCore.use([EffectFade, EffectCards, Navigation]);


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
  backLink?: string
}

export default function Article({ id, children, title, subtitle, content, image, imageSize, gallery, intro, metaInfo, cv, video, onClick, record, backLink }: ArticleProps) {

  const t = useTranslations()
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState<any>({})
  const [caption, setCaption] = useState<string>(gallery?.[0]?.title || image?.title)
  const [offset, setOffset] = useState(0)
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const { isDesktop } = useDevice()
  const ratio = !isDesktop ? 0 : offset ? Math.max(0, Math.min(1, ((scrolledPosition - (offset > viewportHeight ? offset - viewportHeight + 100 : 0)) / viewportHeight))) : 0
  const figureRef = useRef<HTMLElement | null>(null)
  const swiperRef = useRef<SwiperType | undefined>()

  useEffect(() => {
    setCaption(gallery?.[index]?.title || image?.title)
  }, [index])

  console.log(caption)

  return (
    <>
      <DatoSEO title={title} />
      <div className={cn(s.article, 'article')}>
        <header><h1>{title}</h1></header>
        {(image || gallery?.length > 0) &&
          <main>
            <Swiper
              id={`main-gallery`}
              loop={gallery?.length > 1}
              //effect={'fade'}
              slidesPerView={1}
              spaceBetween={0}
              centeredSlides={true}
              simulateTouch={true}
              initialSlide={0}
              onSwiper={(swiper) => swiperRef.current = swiper}
              onSlideChange={({ realIndex }) => {
                setIndex(realIndex)
                setCaption(gallery?.[realIndex]?.title || gallery?.[realIndex]?.alt)
              }}
            >
              {(gallery?.length ? gallery : image ? [image] : null)?.map((img, idx) =>
                <SwiperSlide key={idx} className={cn(s.slide)}>
                  <figure
                    className={cn(s.mainImage, imageSize && s[imageSize], img.height > img.width && s.portrait)}
                    onClick={() => swiperRef.current?.slideNext()}
                    ref={figureRef}
                  >
                    <Image
                      data={img.responsiveImage}
                      lazyLoad={idx === index ? true : false}
                      className={s.image}
                      pictureClassName={s.picture}
                      placeholderClassName={s.placeholder}

                    />
                  </figure>
                  {/*!loaded[image.id] && initLoaded &&
                  <div className={s.loading}><Loader /></div>
                */}
                </SwiperSlide>
              )}
            </Swiper>

          </main>
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
              //onClick={(imageId) => setImageId(imageId)}
              />
            }
            {cv?.map(({ headline, text }, idx) =>
              <React.Fragment key={idx}>
                <Markdown className={s.cv}>{`**${headline}** ${text}`}</Markdown>
              </React.Fragment>
            )}
            {children}
            {backLink &&
              <Link href={backLink}>
                <button>{t('General.backToOverview')}</button>
              </Link>
            }
          </section>
          {metaInfo &&
            <aside>
              {caption &&
                <p>{caption}</p>
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