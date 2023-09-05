import s from './StartImagesDouble.module.scss'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { DatoLink, Link } from '/components'
import { Image } from 'react-datocms/image'
import { useTranslations } from 'next-intl'
import { sectionToSlug } from '/lib/utils'

export type Props = { data: StartImagesDoubleRecord, onClick: Function }

export default function StartImagesDouble({ data: { images } }: Props) {

	const t = useTranslations('Home');

	return (
		<section className={s.images}>
			{images.map(({ image, section, text, title, link }, idx) =>
				<div className={s.block} key={idx}>
					<div className={s.left}>
						<Link href={sectionToSlug(section)} translate={true}>
							<h2 className={s.section}>
								{//@ts-ignore 
									t(section.toLowerCase())
								}
							</h2>
						</Link>
						<DatoLink link={link}>
							<h3>{title}</h3>
							<Markdown className="mid">{text}</Markdown>
							<div>
								<strong className="nav"><span>›</span> Read more</strong>
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
				</div >
			)}
		</section >
	)
}