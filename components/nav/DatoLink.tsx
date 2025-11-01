import Link from 'next/link';
import config from '@/datocms.config';
import * as changeCase from 'change-case';
import { getLocale } from 'next-intl/server';

export type Props = {
	link: ExternalLinkRecord | InternalLinkRecord;
	className?: string;
	children?: React.ReactNode;
};

export default async function DatoLink({ link, className, children }: Props) {
	if (!link) return <a className={className}>{children}</a>;

	const typeName = link.__typename;
	const slug = typeName === 'ExternalLinkRecord' ? link.url : await getInteranlRoute(link);
	const title = typeName === 'ExternalLinkRecord' ? link.title : link.record?.title;

	if (!slug) return <a className={className}>{children}</a>;

	return link.__typename === 'ExternalLinkRecord' ? (
		<a href={slug} className={className}>
			{children ?? title}
		</a>
	) : (
		<Link href={slug} className={className}>
			{children ?? title}
		</Link>
	);
}

async function getInteranlRoute(link: InternalLinkRecord) {
	const locale = await getLocale();
	const apiKey = changeCase.kebabCase(link.record.__typename.replace('Record', ''));
	const route = await config.routes[apiKey]?.(link.record, locale);
	return route?.[0];
}
