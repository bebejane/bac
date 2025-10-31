import { defaultLocale } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { default as NextLink } from 'next/link';

export type Props = {
	href: string;
	children: React.ReactNode | React.ReactNode[];
	className?: string;
	prefetch?: boolean;
	translate?: boolean;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

export default function Link({ href, className, children, prefetch, translate = true, onClick }: Props) {
	const locale = useLocale();
	const h = translate ? translatePath(href, locale, defaultLocale) : href;

	return (
		<NextLink href={h} prefetch={prefetch} className={className} scroll={true} onClick={onClick}>
			{children}
		</NextLink>
	);
}
