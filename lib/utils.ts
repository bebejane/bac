import { format } from 'date-fns/format';
import React from 'react';

export const isServer = typeof window === 'undefined';

export const chunkArray = (array: any[] | React.ReactNode[], chunkSize: number) => {
	const newArr = [];
	for (let i = 0; i < array.length; i += chunkSize) newArr.push(array.slice(i, i + chunkSize));
	return newArr;
};

export const sectionToSlug = (section: string): string => {
	const s = section.toLowerCase();
	switch (s) {
		case 'about':
			return '/about';
		case 'project':
			return '/projects';
		case 'event':
			return '/events';
		case 'contact':
			return '/contact';
		case 'archive':
			return '/archive';
		default:
			throw Error(`${section} is unknown section slug!`);
	}
};

export const isEmail = (string: string): boolean => {
	if (!string) return false;
	const matcher =
		/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	if (string.length > 320) return false;
	return matcher.test(string);
};

export const truncateParagraph = (
	s: string,
	sentances: number = 1,
	ellipsis: boolean = true,
	minLength = 200
): string => {
	if (!s || s.length < minLength) return s;

	let dotIndex = s
		.split('.')
		?.slice(0, sentances + 1)
		.join('.')
		.lastIndexOf('.');
	let qIndex = s
		.split('? ')
		?.slice(0, sentances + 1)
		.join('? ')
		.lastIndexOf('? ');
	const isQuestion = (qIndex !== -1 && qIndex < dotIndex) || (dotIndex === -1 && qIndex > -1);

	if (dotIndex === -1 && qIndex === -1) {
		dotIndex = minLength - 1;
		ellipsis = true;
	}

	let str = s.substring(0, isQuestion ? qIndex : dotIndex); //`${s.substring(0, minLength - 1)}${s.substring(minLength - 1).split('.').slice(0, sentances).join('. ')}`
	return `${str}${ellipsis ? '...' : isQuestion ? '?' : '.'}`;
};

export const isEmptyObject = (obj: any) => Object.keys(obj).filter((k) => obj[k] !== undefined).length === 0;

export const capitalize = (str: string, lower: boolean = false) => {
	return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
};

export const formatDate = (date: string, endDate?: string) => {
	if (!date) return '';
	const s = capitalize(format(new Date(date), 'dd MMM')).replace('.', '');
	const e = endDate ? capitalize(format(new Date(endDate), 'dd MMM')).replace('.', '') : undefined;
	return `${s}${e ? ` – ${e}` : ''}`;
};

export const randomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export type TruncateOptions = {
	sentences: number;
	useEllipsis: boolean;
	minLength: number;
};

export const truncateText = (text: string, options: TruncateOptions): string => {
	let { sentences = 1, useEllipsis = false, minLength = 0 } = options;

	// Split the text into sentences
	const sentencesArr = text.match(/[^\.!\?]+[\.!\?]+/g);

	// If there aren't enough sentences, return the full text
	if (!sentencesArr || sentencesArr.length <= sentences) {
		return text;
	}

	// Create the truncated text by joining specified number of sentences
	let truncatedText = sentencesArr.slice(0, sentences).join(' ');

	// Cut off at ! and ? until minimum length is reached
	while (truncatedText.length < minLength && truncatedText.search(/[!?]/) > -1) {
		truncatedText = truncatedText.concat(
			sentencesArr[sentences].match(/^[^!.?]+[!.?]+/) ? sentencesArr[sentences].match(/^[^!.?]+[!.?]+/)[0] : ''
		);
		sentences++;
	}

	if (useEllipsis) {
		truncatedText += '...';
	}

	return truncatedText;
};

export const truncateWords = (text: string, minLength: number): string => {
	if (text.length <= minLength) {
		return text;
	}
	var truncatedText = text.substr(0, minLength);
	var lastSpaceIndex = truncatedText.lastIndexOf(' ');
	if (lastSpaceIndex !== -1) {
		truncatedText = truncatedText.substr(0, lastSpaceIndex);
	}
	return truncatedText + '...';
};

export const randomLogoFonts = (count: number): string[] => {
	const fonts = ['Logo1', 'Logo2', 'Logo3', 'Logo4'];
	const items = [];

	for (let i = 0; i < count; i++) {
		const f = fonts[Math.floor(Math.random() * fonts.length)];
		if (items.slice(-1)[0] === f) {
			i--;
			continue;
		} else items.push(f);
	}
	return items;
};
