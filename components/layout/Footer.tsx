import s from './Footer.module.scss';
import cn from 'classnames';

export type FooterProps = {
	contact: ContactQuery['contact'];
};

export default function Footer({ contact: { email, instagram, mailingAddress } }: FooterProps) {
	return (
		<footer className={cn(s.footer)} id='footer'>
			<div>
				<span>Baltic Art Center</span>
				<span>{mailingAddress}</span>
				<span>
					<a href={`mailto:${email}`}>{email}</a>
				</span>
			</div>
			<div>
				<span>
					<a href={instagram}>Instagram</a>
				</span>
			</div>
		</footer>
	);
}
