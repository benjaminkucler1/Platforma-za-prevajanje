import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { DOMParser } from '@xmldom/xmldom';
import type { WordPair } from './types/interfaces';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

//ENUMS
export function getEnumValues<T extends object>(enumObj: T): readonly [string, ...string[]] {
	const values = Object.values(enumObj) as string[];
	if (values.length === 0) {
		throw new Error('Enum must have at least one value');
	}
	return values as [string, ...string[]];
}

//XML PARSER

export const XMLParser = (XMLString: string, tagName = 'string'): WordPair[] => {
	//contect: XMLString, featuring tag <string> with name attribute and value
	const parser = new DOMParser();
	const xmlData = parser.parseFromString(XMLString, 'application/xml');
	const result: WordPair[] = [];

	const strings = xmlData.getElementsByTagName(tagName);
	for (let i = 0; i < strings.length; i++) {
		const name = strings[i].getAttribute('name');
		const value = strings[i].textContent ?? '';
		if (name) {
			result.push({ name, value });
		}
	}
	return result;
};

//PROGRESS
export const calculateProgress = (words: WordPair[]) => {
	if (words.length === 0) return 0;

	const filledCount = words.filter((word) => word.value !== '').length;
	const percentage = Math.round((filledCount / words.length) * 100);
	return percentage;
};

//CONCAT
export const concatWithDots = (words: string[]) => {
	return words.reduce((acc, str) => {
	  // Replace any dot inside the string with "(.)" but not at the end
	  const modifiedStr = str.replace(/\.(?=\S)/g, '()');
  
	  // Concatenate the string with a dot in between, unless acc ends with a dot
	  if (acc.endsWith('.')) {
		return acc + modifiedStr;
	  } else {
		return acc + '.' + modifiedStr;
	  }
	});
  };
