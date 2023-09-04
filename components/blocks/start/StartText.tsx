import s from './StartText.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { DatoLink } from '/components'

export type Props = { data: StartTextRecord, onClick: Function }

export default function StartText({ data: { id, text, layout, section, title, link } }: Props) {

	return (
		<div className={cn(s.section, s[layout])}>
			<DatoLink link={link}>
				<h3>{title}</h3>
				<Markdown>{text}</Markdown>
			</DatoLink>
		</div>
	)
}