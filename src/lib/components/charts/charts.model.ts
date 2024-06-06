import type { ChartData, ChartOptions } from 'chart.js/auto';

export interface IBarChart {
	data: ChartData<'bar'>;
	options?: ChartOptions<'bar'>;
	height?: number;
	width?: number;
}
