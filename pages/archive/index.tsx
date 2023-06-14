import s from "./[event].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllArchivesDocument, ArchiveIntroDocument } from "/graphql";
import { pageSlugs } from "/lib/i18n";
import { StructuredContent } from "/components";
import { apiQueryAll } from "dato-nextjs-utils/api";
import Link from "next/link";
import { ar } from "date-fns/locale";

export type Props = {
	archiveIntro: ArchiveIntroRecord
	archives: ArchiveRecord[]
}

export type ArchivesByYear = {
	year: number
	archives: ArchiveRecord[]
}[]

export default function Archive({ archives, archiveIntro: { title, content }, archiveIntro }: Props) {

	const archivesByYear = archives.reduce((acc, archive) => {
		const year = new Date(archive._createdAt).getFullYear();
		const yearArchives = acc.find(el => el.year === year);
		if (yearArchives) {
			yearArchives.archives.push(archive);
		} else {

			acc.push({
				year,
				archives: [archive]
			});
		}
		return acc;
	}, [] as ArchivesByYear).sort((a, b) => a.year < b.year ? 1 : -1);

	return (
		<section>
			<h1>{title}</h1>
			<StructuredContent
				id={archiveIntro.id}
				record={archiveIntro}
				content={content}
			/>
			{archivesByYear.map(({ archives, year }, idx) =>
				<>
					<h3>{year}</h3>
					<ul key={idx}>
						{archives.map(({ title, _createdAt, slug }, index) =>
							<Link key={index} href={`/archive/${slug}`} locale="en">
								<li>{title}</li>
							</Link>
						)}
					</ul>
				</>

			)}

		</section>
	);
}


export const getStaticProps = withGlobalProps({ queries: [ArchiveIntroDocument] }, async ({ props, revalidate, context }: any) => {

	const { archives } = await apiQueryAll(AllArchivesDocument, { preview: context.preview })

	return {
		props: {
			...props,
			archives,
			page: {
				section: 'event',
				slugs: pageSlugs('event'),
			} as PageProps
		},
		revalidate
	}
})