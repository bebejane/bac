import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { Block } from "/components";
import { pageSlugs } from "/lib/i18n";
import { DatoMarkdown as MarkDown } from "dato-nextjs-utils/components";
import { useTranslations } from "next-intl";

export type Props = {
	start: StartRecord
}

export default function Home({ start }: Props) {
	const t = useTranslations('Home');

	return (
		<div className={s.container}>
			{start?.content?.map((block, idx) =>
				<Block key={idx} data={block} record={start} />
			)}
			<section className={s.about}>
				<h2>{t('about')}</h2>
				<MarkDown>{start.about}</MarkDown>
			</section>
		</div>
	);
}

export const getStaticProps = withGlobalProps({ queries: [StartDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				section: 'home',
				slugs: pageSlugs('home'),
			} as PageProps
		},
		revalidate
	}
})