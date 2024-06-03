import type { IProject } from '$lib/models/project.model';
import { jc } from '$lib/server/jiraClient';
import { isWithinLastNMonths } from '$lib/utils';
import { json } from '@sveltejs/kit';

export async function GET() {
	const projects = jc.projects.searchProjects({
		properties: ['name', 'key'],
		maxResults: 100,
		expand: ['insight']
	});
	const result: IProject[] = (await projects).values
		.filter(
			(p) => isWithinLastNMonths(6, p.insight?.lastIssueUpdateTime) && p.insight?.totalIssueCount
		)
		.map((p) => ({
			name: p.name,
			key: p.key,
			icon: p.avatarUrls?.['16x16']
		}))
		.sort((a, b) => (a.name < b.name ? -1 : 1));
	return json(result);
}
