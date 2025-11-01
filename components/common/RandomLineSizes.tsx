'use client';

import { useEffect } from 'react';

export default function RandomLineSizes() {
	useEffect(() => {
		const lineSizes = [1, 4, 6];
		const hrs = document.getElementById('start')?.querySelectorAll('hr');
		hrs?.forEach((hr) => {
			const i = Math.floor(Math.random() * lineSizes.length);
			hr.style.setProperty('height', `${lineSizes[i]}px`);
		});
	}, []);
	return null;
}
