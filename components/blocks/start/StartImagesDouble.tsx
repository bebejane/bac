import s from './StartImagesDouble.module.scss'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { DatoLink } from '/components'
import { Image } from 'react-datocms/image'

export type Props = { data: StartImagesDoubleRecord, onClick: Function }

export default function StartImagesDouble({ data: { images } }: Props) {

	return (
		<section className={s.images}>
			{images.map(({ image, section, text, title, link }, idx) =>
				<div className={s.block}>
					<div className={s.left}>
						<h2 className={s.section}>
							{section}
						</h2>
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