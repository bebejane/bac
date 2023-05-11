import s from './Footer.module.scss'
import cn from 'classnames'
import type { MenuItem } from '/lib/menu'
import KFLogo from '/public/images/kf-logo.svg'
import { useTranslations } from 'next-intl'
import { usePage } from '/lib/context/page'

export type FooterProps = {
	menu: MenuItem[]

}

export default function Footer({ menu }: FooterProps) {
	const t = useTranslations('Footer')
	const { isHome } = usePage()

	return (
		<footer className={cn(s.footer)} id="footer">
			footer
		</footer>
	)
}