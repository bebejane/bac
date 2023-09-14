import s from './StartImage.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { StructuredContent } from '/components'
import { DatoLink, Link } from '/components'
import { Image } from 'react-datocms/image'
import { useTranslations } from 'next-intl'
import { sectionToSlug } from '/lib/utils'

export type Props = { data: StartImageRecord, onClick: Function }

export default function StartImage({ data: { id, image, layout, section, text, title, link }, data }: Props) {

	const t = useTranslations('Home');

	return (
		<section className={cn(s.imageBlock, s[layout])}>
			<div className={s.left}>
				<Link href={sectionToSlug(section)} translate={true}>
					<h2 className={s.section}>
						{//@ts-ignore 
							t(section.toLowerCase())
						}
					</h2>
				</Link>
				<DatoLink link={link}>
					<h1>{title}</h1>
					<StructuredContent id={id} record={data} content={text} />
					<div>
						<strong className="nav"><span>›</span> {t('readMore')}</strong>
					</div>
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