import s from './Footer.module.scss'
import cn from 'classnames'
import type { MenuItem } from '/lib/menu'
import KFLogo from '/public/images/kf-logo.svg'
import { useTranslations } from 'next-intl'
import { usePage } from '/lib/context/page'

export type FooterProps = {
	contact: ContactRecord

}

export default function Footer({ contact: { email, instagram, mailingAddress } }: FooterProps) {

	const { isHome } = usePage()

	return (
		<footer className={cn(s.footer)} id="footer">
			<span>Baltic Art Center</span>
			<span>{mailingAddress}</span>
			<span><a href={`mailto:${email}`}>{email}</a></span>
			<span><a href={instagram}>Instagram</a></span>
		</footer>
	)
}