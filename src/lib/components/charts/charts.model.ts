import type { ChartData, ChartOptions } from 'chart.js/auto';

export interface IBarChart {
	data: ChartData<'bar'>;
	options?: ChartOptions<'bar'>;
	height?: number;
	title?: string;
	width?: number;
}

export interface ILineChart {
	data: ChartData<'line'>;
	options?: ChartOptions<'line'>;
	height?: number;
	width?: number;
	title?: string;
}
