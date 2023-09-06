import s from './StartVideo.module.scss'
import React from 'react'
import { DatoLink, VideoPlayer } from '/components'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'

export type Props = { data: StartVideoRecord }

export default function StartVideo({ data: { video, title, section, text, link } }: Props) {

	const ref = useRef()
	const t = useTranslations('Home');


	return (
		<section className={s.video} ref={ref}>
			<div className={s.left}>
				<DatoLink link={link} className={s.videoWrap}>
					<VideoPlayer data={video} />
				</DatoLink>
			</div>
			<div className={s.right}>
				<h2 className={s.section}>
					{//@ts-ignore 
						t(section.toLowerCase())
					}
				</h2>

				<div className={s.content}>
					<DatoLink link={link} className={s.title}>
						<h1>{title}</h1>
					</DatoLink>
					<Markdown className={s.text}>{text}</Markdown>
					<strong className="nav"><span>›</span> {t('readMore')}</strong>

				</div>
			</div>
		</section >
	)
}