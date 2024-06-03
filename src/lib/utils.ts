import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

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
export function isWithinLastNMonths(n: number, date?: string) {
	const dateToCheck = dayjs(date); // Convert the date to a dayjs object
	const nMonthsAgo = dayjs().subtract(n, 'month'); // Get the date 6 months ago

	return dateToCheck.isAfter(nMonthsAgo);
}

export function daysToText(days: number) {
	// Handle invalid input (negative or non-numeric)
	if (days < 0 || !Number.isInteger(days)) {
		return 'Invalid input: Please enter a non-negative whole number of days.';
	}

	const years = Math.floor(days / 365);
	days %= 365;
	const months = Math.floor(days / 30);
	days %= 30;

	// Handle pluralization for months and days
	const yearText = years === 1 ? 'year' : 'years';
	const monthText = months === 1 ? 'month' : 'months';
	const dayText = days === 1 ? 'day' : 'days';

	// Construct the text representation
	let text = '';
	if (years > 0) {
		text += `${years} ${yearText}, `;
	}
	if (months > 0) {
		text += `${months} ${monthText}, `;
	}
	if (days > 0) {
		text += `${days} ${dayText}`;
	}

	// Remove trailing comma and space if necessary
	text = text.trim().slice(0, -1);

	return text;
}
