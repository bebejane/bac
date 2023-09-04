import s from './StartImage.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { DatoLink } from '/components'
import { Image } from 'react-datocms/image'
import { useTranslations } from 'next-intl'

export type Props = { data: StartImageRecord, onClick: Function }

export default function StartImage({ data: { id, image, layout, section, text, title, link } }: Props) {

	const t = useTranslations('Home');

	return (
		<section className={cn(s.imageBlock, s[layout])}>
			<div className={s.left}>
				<h2 className={s.section}>
					{//@ts-ignore 
						t(section.toLowerCase())
					}
				</h2>
				<DatoLink link={link}>
					<h1>{title}</h1>
					<Markdown className="mid">{text}</Markdown>
					<span><strong className="nav">› Read more</strong></span>
				</DatoLink>
			</div>
			<DatoLink link={link} className={s.right}>
				<figure>
					{image &&
						<>
							<div className={s.cover}></div>
							<Image
								data={image.responsiveImage}
								className={s.image}
								pictureClassName={s.picture}
							/>
						</>
					}
				</figure>
			</DatoLink >
		</section >
	)
}