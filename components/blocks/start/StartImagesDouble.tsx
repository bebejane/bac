import s from './StartImagesDouble.module.scss'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { DatoLink } from '/components'
import { Image } from 'react-datocms/image'
import { useTranslations } from 'next-intl'

export type Props = { data: StartImagesDoubleRecord, onClick: Function }

export default function StartImagesDouble({ data: { images } }: Props) {

	const t = useTranslations('Home');

	return (
		<section className={s.images}>
			{images.map(({ image, section, text, title, link }, idx) =>
				<div className={s.block} key={idx}>
					<div className={s.left}>
						<h2 className={s.section}>
							{//@ts-ignore 
								t(section.toLowerCase())
							}
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
			)}
		</section >
	)
}