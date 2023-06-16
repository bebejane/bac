import s from './StartSelectedProject.module.scss'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { recordToSlug } from '/lib/utils'
import { Link } from '/components'
import { Image } from 'react-datocms/image'

export type Props = { data: StartSelectedProjectRecord, onClick: Function }

export default function StartSelectedProject({ data: { projects } }: Props) {

	return (
		<section className={s.section}>
			<ul>
				{projects.map(({ title, subtitle, intro, image, slug }, idx) =>
					<Link href={`/projects/${slug}`} key={idx}>
						<li>
							<div>
								<h3>{title}</h3>
								<span>{subtitle}</span>
								<Markdown>{intro}</Markdown>
							</div>
							<figure>
								{image && <Image data={image.responsiveImage} className={s.image} pictureClassName={s.picture} />}
							</figure>
						</li>
					</Link>
				)}
			</ul>
		</section>
	)

}