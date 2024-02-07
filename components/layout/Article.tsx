import s from './Article.module.scss'
import "swiper/css/effect-fade";
import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { StructuredContent, VideoPlayer } from "/components";
import { Image } from 'react-datocms';
import { DatoSEO } from 'dato-nextjs-utils/components';
import Link from '/components/nav/Link'
import { useTranslations } from 'next-intl';
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, EffectCards } from 'swiper'
import { render } from 'datocms-structured-text-to-plain-text'
import SwiperCore from 'swiper'
import type { Swiper as SwiperType } from 'swiper'

SwiperCore.use([EffectFade, EffectCards]);

export type ArticleProps = {
  id: string
  children?: React.ReactNode | React.ReactNode[] | undefined
  aside?: React.ReactNode | React.ReactNode[] | undefined
  title?: string
  subtitle?: string
  intro?: any
  image?: ImageFileField
  video?: VideoField
  videoImage?: ImageFileField
  gallery?: FileField[] | VideoField[]
  imageSize?: 'small' | 'medium' | 'large'
  content?: any
  metaInfo?: MetaInfoRecord[]
  cv?: CvRecord[]
  onClick?: (id: string) => void
  record?: any
  backLink?: string
  medium?: boolean
  noImages?: boolean
  seo?: Tag[]
}

export default function Article({ id, children, title, subtitle, content, image, imageSize, gallery, intro, metaInfo, cv, video, videoImage, onClick, record, backLink, medium, noImages, seo }: ArticleProps) {

  const t = useTranslations()
  const [index, setIndex] = useState(0)
  const figureRef = useRef<HTMLElement | null>(null)
  const swiperRef = useRef<SwiperType | undefined>()
  //@ts-ignore
  const slides: (ImageFileField | FileField | VideoField | null | undefined)[] = [video].concat(gallery?.length ? gallery : [image]).filter(el => el)
  const [caption, setCaption] = useState<string | undefined>(slides?.[index]?.title)
  const haveAside = metaInfo || caption

  useEffect(() => {
    setCaption(slides?.[index]?.title?.replaceAll('<br>', '\n'))
  }, [index])


  return (
    <>
      <DatoSEO title={title} description={render(intro)?.split('\n')[0]} seo={seo} />
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
              onSlideChange={({ realIndex }) => setIndex(realIndex)}
            >
              {slides?.map((slide, idx) =>
                <SwiperSlide key={idx} className={cn(s.slide, slides.length === 1 && s.solo)}>
                  {slide.__typename == 'ImageFileField' || (slide.__typename == 'FileField' && slide.responsiveImage) ?
                    <figure
                      className={cn(s.mainImage, imageSize && s[imageSize], slide.height > slide.width && s.portrait)}
                      onClick={() => swiperRef.current?.slideNext()}
                      ref={figureRef}
                    >
                      <Image
                        data={slide.responsiveImage}
                        lazyLoad={idx === index ? true : false}
                        className={s.image}
                        fadeInDuration={0}
                        pictureClassName={s.picture}
                        placeholderClassName={s.placeholder}
                      />
                    </figure>
                    : <VideoPlayer data={slide} image={videoImage} />
                  }
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
        <div className={cn(s.wrapper, (medium && !haveAside) && s.medium)}>
          <section className={s.content}>
            {subtitle && <h3>{subtitle}</h3>}
            <StructuredContent
              id={id}
              record={record}
              content={intro}
            />
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
            {cv?.map(({ headline, text }, idx) => {
              return (
                <div className={cn("mid", s.cv)} key={idx}>
                  <strong>{headline?.trim()} </strong>
                  <StructuredContent
                    id={id}
                    record={record}
                    content={text}
                  />
                </div>
              )
            })}
            {children}
          </section>
          {haveAside &&
            <aside>
              {caption &&
                <Markdown className={s.caption}>{caption}</Markdown>
              }
              {metaInfo?.map(({ headline, text }, idx) =>
                <React.Fragment key={idx}>
                  <h3>{headline}</h3>
                  <StructuredContent
                    id={id}
                    record={record}
                    content={text}
                  />
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

