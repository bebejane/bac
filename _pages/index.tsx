import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { Block } from "/components";
import { pageProps } from "/lib/i18n";
import React, { useEffect, useRef } from "react";

export type Props = {
	start: StartRecord
}

export default function Home({ start }: Props) {

	const containerRef = useRef<HTMLDivElement>(null);
	const lineSizes = [1, 4, 6]

	useEffect(() => { // Randomize line sizes
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
		</div>
	);
}

export const getStaticProps = withGlobalProps({ queries: [StartDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: pageProps('home')
		},
		revalidate
	}
})