import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllArchivesDocument, ArchiveIntroDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { Article, CardContainer, Card } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";
import { randomInt, randomLogoFonts } from "/lib/utils";
import Link from '/components/nav/Link'
import React from "react";

export type Props = {
	archiveIntro: ArchiveIntroRecord
	archives: ArchiveRecord[]
	randomFonts: string[]
}

export type ArchivesByYear = {
	year: number
	archives: ArchiveRecord[]
}[]

export default function Archive({ archives, archiveIntro: { title, text }, randomFonts }: Props) {

	const archivesByYear = archives.reduce((acc, archive) => {
		const year = new Date(archive._createdAt).getFullYear();
		const yearArchives = acc.find(el => el.year === year);
		if (yearArchives)
			yearArchives.archives.push(archive);
		else
			acc.push({ year, archives: [archive] });

		return acc;
	}, [] as ArchivesByYear).sort((a, b) => a.year < b.year ? 1 : -1);

	return (
		<Article
			id={'archive'}
			title={title}
			intro={text}
		>
			<div className={s.list}>
				{archivesByYear.map(({ archives, year }, i) => {
					return (
						<CardContainer key={i}>
							{archives.map(({ title, slug, _createdAt }, idx) =>
								<React.Fragment key={idx}>
									{idx === 0 &&
										<Card>
											<h2 className={s.year} style={{ fontFamily: randomFonts[i] }}>
												{year.toString()}
											</h2>
										</Card>
									}
									<Card>
										<Link href={`/archive/${slug}`} translate={false} className={s.thumbnail}>
											<h3 className={s.title}>{title}</h3>
										</Link>
									</Card>
								</React.Fragment>
							)}
						</CardContainer>
					)
				})}
			</div>
		</Article>
	);
}

export const getStaticProps = withGlobalProps({ queries: [ArchiveIntroDocument] }, async ({ props, revalidate, context }: any) => {

	const { archives } = await apiQueryAll(AllArchivesDocument, { preview: context.preview })

	return {
		props: {
			...props,
			archives,
			randomFonts: randomLogoFonts(archives.length),
			page: {
				section: 'archive',
				slugs: pageSlugs('archive'),
			} as PageProps
		},
		revalidate
	}
})