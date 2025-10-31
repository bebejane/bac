'use client';

import { useEffect } from 'react';

export const PaletteAnimation = () => {
	useEffect(() => {
		document.body.classList.add('background-palette-animation');
		return () => document.body.classList.remove('background-palette-animation');
	}, []);

	return null;
};
