import s from "./[event].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllArchivesDocument, ArchiveIntroDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { Article, StructuredContent } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";
import Link from "next/link";
import { ar } from "date-fns/locale";
import React from "react";

export type Props = {
	archiveIntro: ArchiveIntroRecord
	archives: ArchiveRecord[]
}

export type ArchivesByYear = {
	year: number
	archives: ArchiveRecord[]
}[]

export default function Archive({ archives, archiveIntro: { title, text }, archiveIntro }: Props) {

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
			{archivesByYear.map(({ archives, year }, idx) =>
				<React.Fragment key={idx}>
					<h3>{year}</h3>
					<ul key={idx}>
						{archives.map(({ title, _createdAt, slug }, index) =>
							<Link key={index} href={`/archive/${slug}`} locale="en">
								<li>{title}</li>
							</Link>
						)}
					</ul>
				</React.Fragment>
			)}
		</Article>
	);
}


export const getStaticProps = withGlobalProps({ queries: [ArchiveIntroDocument] }, async ({ props, revalidate, context }: any) => {

	const { archives } = await apiQueryAll(AllArchivesDocument, { preview: context.preview })

	return {
		props: {
			...props,
			archives,
			page: {
				section: 'archive',
				slugs: pageSlugs('archive'),
			} as PageProps
		},
		revalidate
	}
})