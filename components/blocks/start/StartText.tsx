import s from './StartText.module.scss'
import React from 'react'
import { DatoLink, StructuredContent } from '/components'

export type Props = { data: StartTextRecord, onClick: Function }

export default function StartText({ data: { id, text, section, link, title }, data }: Props) {

	return (
		<section className={s.section}>
			<DatoLink link={link}>
				<h3>{title}</h3>
			</DatoLink>
			<DatoLink link={link}>
				<StructuredContent id={id} record={data} content={text} />
			</DatoLink>
		</section>
	)
}