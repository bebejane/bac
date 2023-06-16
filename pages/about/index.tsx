import withGlobalProps from "/lib/withGlobalProps";
import { pageSlugs } from "/lib/i18n";

export type Props = {

}

export default function About({ }: Props) {

	return (
		<></>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				section: 'about',
				slugs: pageSlugs('about'),
			} as PageProps
		},
		revalidate
	}
})