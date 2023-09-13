import s from './Article.module.scss'
import "swiper/css/effect-fade";
import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { StructuredContent, ExternalVideo } from "/components";
import { Image } from 'react-datocms';
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { DatoSEO } from 'dato-nextjs-utils/components';
import Link from '/components/nav/Link'
import { useTranslations } from 'next-intl';
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import useDevice from '/lib/hooks/useDevice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, EffectCards, Navigation } from 'swiper'
import SwiperCore from 'swiper'
import type { Swiper as SwiperType } from 'swiper'

SwiperCore.use([EffectFade, EffectCards]);


export type ArticleProps = {
  id: string
  children?: React.ReactNode | React.ReactNode[] | undefined
  aside?: React.ReactNode | React.ReactNode[] | undefined
  title?: string
  subtitle?: string
  intro?: string
  image?: ImageFileField
  video?: VideoField
  videoImage?: ImageFileField
  gallery?: ImageFileField[]
  imageSize?: 'small' | 'medium' | 'large'
  content?: any
  metaInfo?: MetaInfoRecord[]
  cv?: CvRecord[]
  onClick?: (id: string) => void
  record?: any
  backLink?: string
  medium?: boolean
  noImages?: boolean
}

export default function Article({ id, children, title, subtitle, content, image, imageSize, gallery, intro, metaInfo, cv, video, videoImage, onClick, record, backLink, medium, noImages }: ArticleProps) {

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
  //@ts-ignore
  const slides: (ImageFileField | VideoField | null | undefined)[] = [video].concat(gallery?.length ? gallery : [image]).filter(el => el)

  useEffect(() => {
    const c = (gallery?.[index]?.title || image?.title)?.replaceAll('<br>', '\n')
    setCaption(c)
  }, [index])

  return (
    <>
      <DatoSEO title={title} />
      <div className={cn(s.article, 'article')}>
        <header><h1>{title}</h1></header>
        {slides.length > 0 &&
          <div className={s.gallery}>
            <Swiper
              id={`main-gallery`}
              loop={gallery?.length > 1}
              className={s.swiper}
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
              {slides?.map((slide, idx) =>
                <SwiperSlide key={idx} className={cn(s.slide, slides.length === 1 && s.solo)}>
                  {slide.__typename === 'ImageFileField' ?
                    <figure
                      className={cn(s.mainImage, imageSize && s[imageSize], slide.height > slide.width && s.portrait)}
                      onClick={() => swiperRef.current?.slideNext()}
                      ref={figureRef}
                    >
                      <Image
                        data={slide.responsiveImage}
                        lazyLoad={idx === index ? true : false}
                        className={s.image}
                        pictureClassName={s.picture}
                        placeholderClassName={s.placeholder}
                      />
                    </figure>
                    : slide.__typename === 'VideoField' ?
                      <ExternalVideo data={slide} image={videoImage} />
                      : null}
                </SwiperSlide>
              )}
            </Swiper>
            {slides?.length > 1 &&
              <>
                <ul className={s.pagination}>
                  {slides.map((image, i) =>
                    <li
                      key={i}
                      className={cn(i === index && s.selected)}
                      onClick={() => swiperRef.current.slideTo(i + 1)}
                    >
                      <span>•</span>
                    </li>
                  )}
                </ul>
                <button className={s.next} onClick={() => swiperRef.current?.slideNext()} >›</button>
                <button className={s.prev} onClick={() => swiperRef.current?.slidePrev()} >‹</button>
              </>
            }
          </div>
        }
        <p className={s.captionMobile}>{caption}</p>
        <div className={cn(s.wrapper, medium && s.medium)}>
          <section className={s.content}>
            {subtitle && <h3>{subtitle}</h3>}
            <Markdown className={cn(s.intro)}>{intro}</Markdown>
            {content &&
              <section className="structured">
                <StructuredContent
                  id={id}
                  record={record}
                  content={content}
                  noImages={noImages}
                />
              </section>
            }
            {cv?.map(({ headline, text }, idx) =>
              <React.Fragment key={idx}>
                <Markdown className={cn("mid", s.cv)}>{`**${headline?.trim()}** ${text}`}</Markdown>
              </React.Fragment>
            )}
            {children}

          </section>
          {metaInfo &&
            <aside>
              {caption &&
                <Markdown className={s.caption}>{caption}</Markdown>
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
        {backLink &&
          <Link href={backLink}>
            <button><span>‹ </span>{t('General.backToOverview')}</button>
          </Link>
        }
      </div >
    </>
  )
}

