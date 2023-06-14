import s from './Language.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { capitalize } from '/lib/utils'
import { usePage } from '/lib/context/page'
import { Menu } from '/lib/menu'
import { locales } from '/lib/i18n'

export type Props = {
	menu: Menu
}

export default function Language({ menu }: Props) {

	const { locale } = useRouter()
	const { slugs } = usePage()

	if (locales.length <= 1) return null
	const slug = slugs.find((item) => item.locale !== locale)

	return (

		<Link
			href={slug.value}
			locale={slug.locale}
		>
			{slug.locale === 'en' ? 'English' : 'Svenska'}
		</Link>

	)
}
