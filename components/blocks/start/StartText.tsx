import s from './StartText.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { DatoLink } from '/components'

export type Props = { data: StartTextRecord, onClick: Function }

export default function StartText({ data: { id, text, layout, section, title } }: Props) {

	return (
		<section className={cn(s.section, s[layout])}>
			<h3>{title}</h3>
			<Markdown>{text}</Markdown>
		</section>
	)
}