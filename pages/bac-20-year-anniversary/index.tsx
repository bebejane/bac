import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AnniversaryDocument, AllAnniversaryPagesDocument } from "/graphql";
import { pageProps } from "/lib/i18n";
import { DatoMarkdown as Markdown, DatoSEO } from "dato-nextjs-utils/components";
import { Article, Link, StructuredContent } from "/components";
import { Image } from "react-datocms";
import { useEffect } from "react";

export type Props = {
	anniversary: AnniversaryRecord
	anniversaryPages: AnniversaryPageRecord[]
}

export default function Anniversary({ anniversary: { id, title, intro, content }, anniversary, anniversaryPages }: Props) {

	useEffect(() => {
		document.body.classList.add('background-palette-animation')
		return () => document.body.classList.remove('background-palette-animation')
	}, [])

	return (
		<>
			<DatoSEO title={title} />
			<div className={s.logo}>
				<img src="/images/anniversary-logo.svg" />
			</div>
			<Article id={id}>

				<div className={s.introWrap}>
					<h1>{title}</h1>
					<Markdown className={s.intro}>{intro}</Markdown>
				</div>
				<ul className={s.pages}>
					{anniversaryPages.map(({ title, image, slug }, idx) =>
						<li key={idx}>
							<Link href={`/bac-20-year-anniversary/${slug}`}>
								<figcaption>
									<h2>Nedslag i arkivet</h2>
									<div>
										<h3>{title}</h3>
										<p className="mid">{title}</p>
									</div>
								</figcaption>

								<figure>
									{image &&
										<Image
											data={image.responsiveImage}
											className={s.image}
											pictureClassName={s.picture}
										/>
									}
								</figure>
							</Link>
						</li>
					)}
				</ul>
				<section className={cn("mid", s.text)}>
					<StructuredContent id={id} record={anniversary} content={content} />
				</section>
			</Article >
		</>

	);
}


export const getStaticProps = withGlobalProps({ queries: [AnniversaryDocument, AllAnniversaryPagesDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: pageProps('anniversary')
		},
		revalidate
	}
})