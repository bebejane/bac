import s from './StartImage.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { recordToSlug } from '/lib/utils'
import { DatoLink } from '/components'
import { Image } from 'react-datocms/image'

export type Props = { data: StartImageRecord, onClick: Function }

export default function StartImage({ data: { id, image, layout, section, text, title, link } }: Props) {

	return (
		<div className={cn(s.imageBlock, s[layout])}>
			<div className={s.left}>
				<h2 className={s.section}>
					{section}
				</h2>
				<DatoLink link={link}>
					<h1>{title}</h1>
					<Markdown className="mid">{text}</Markdown>
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
		</div >
	)
}