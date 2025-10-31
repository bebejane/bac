'use client';

import s from './Content.module.scss';
import cn from 'classnames';
import React from 'react';
import { Menu } from '@/lib/menu';
import useStore, { useShallow } from '@/lib/store';
import { usePathname } from 'next/navigation';

export type ContentProps = {
	children: React.ReactNode;
	menu: Menu;
};

export default function Content({ children, menu }: ContentProps) {
	const pathname = usePathname();
	const [showMenu] = useStore(useShallow((state) => [state.showMenu]));

	return (
		<main id='content' className={cn(s.content, !showMenu && s.full)} key={pathname}>
			<article>{children}</article>
		</main>
	);
}
