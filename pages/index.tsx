import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { Block } from "/components";
import { pageSlugs } from "/lib/i18n";
import { DatoMarkdown as MarkDown } from "dato-nextjs-utils/components";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";

export type Props = {
	start: StartRecord
}

export default function Home({ start }: Props) {
	const t = useTranslations('Home');
	const containerRef = useRef<HTMLDivElement>(null);
	const lineSizes = [1, 2, 3, 4]

	useEffect(() => {
		const hrs = containerRef.current?.querySelectorAll('hr');
		hrs?.forEach(hr => {
			const i = Math.floor(Math.random() * lineSizes.length);
			hr.style.setProperty('height', `${lineSizes[i]}px`);
		})
	}, [])

	return (
		<div className={s.container} ref={containerRef}>
			{start?.content?.map((block, idx) =>
				<React.Fragment key={idx}>
					<hr />
					<Block data={block} record={start} />
				</React.Fragment>
			)}
			<hr />
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