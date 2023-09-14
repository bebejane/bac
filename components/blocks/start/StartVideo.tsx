import s from './StartVideo.module.scss'
import React from 'react'
import { DatoLink, VideoPlayer, Link, StructuredContent } from '/components'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { sectionToSlug } from '/lib/utils'

export type Props = { data: StartVideoRecord }

export default function StartVideo({ data: { id, video, title, section, text, link }, data }: Props) {

	const ref = useRef()
	const t = useTranslations('Home');

	return (
		<section className={s.video} ref={ref}>
			<div className={s.left}>
				<DatoLink link={link} className={s.videoWrap}>
					<video
						src={data.video?.video['mp4high']}
						playsInline
						loop={true}
						autoPlay={true}
						muted={true}
						disablePictureInPicture={true}
					/>
				</DatoLink>
			</div>
			<div className={s.right}>
				<Link href={sectionToSlug(section)} translate={true}>
					<h2 className={s.section}>
						{//@ts-ignore 
							t(section.toLowerCase())
						}
					</h2>
				</Link>

				<div className={s.content}>
					<DatoLink link={link} className={s.title}>
						<h1>{title}</h1>
						<div className={s.text}>
							<StructuredContent id={id} record={data} content={text} />
						</div>
						<div className={s.readmore}>
							<strong className="nav"><span>›</span> {t('readMore')}</strong>
						</div>
					</DatoLink>
				</div>
			</div>
		</section >
	)
}