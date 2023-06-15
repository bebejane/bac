import s from './StartSelectedEvent.module.scss'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { recordToSlug } from '/lib/utils'
import { Link } from '/components'
import { Image } from 'react-datocms/image'

export type Props = { data: StartSelectedEventRecord, onClick: Function }

export default function StartSelectedEvent({ data: { events } }: Props) {

	return (
		<section className={s.section}>
			<ul>
				{events.map(({ title, subtitle, intro, image, slug }, idx) =>
					<Link href={`/events/${slug}`}>
						<li>
							<p>
								<h3>{title}</h3>
								<span>{subtitle}</span>
								<Markdown>{intro}</Markdown>
							</p>
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