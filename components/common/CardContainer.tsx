import s from './CardContainer.module.scss';
import cn from 'classnames';

export type Props = {
	children?: React.ReactNode | React.ReactNode[];
	className?: string;
};

export default function CardContainer({ children, className }: Props) {
	return <ul className={cn(s.container, s.three, className)}>{children}</ul>;
}
