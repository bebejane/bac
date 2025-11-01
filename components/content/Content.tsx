import { StructuredContent } from 'next-dato-utils/components';
import * as Blocks from './blocks/index';

export type Props = {
	id?: string;
	content: any;
	styles?: any;
	className?: string;
	blocks?: any;
	noImages?: boolean;
	options?: {
		unwrapParagraphs?: boolean;
	};
};

export default function Content({ content, styles, blocks, className, noImages, options = {} }: Props) {
	if (!content) return null;

	const b = { ...Blocks, ...blocks };
	if (noImages) Object.keys(b).forEach((k) => k === 'Image' && delete b[k]);

	return (
		<StructuredContent blocks={b} className={className} styles={{ ...styles }} content={content} options={options} />
	);
}
