import { jc } from '$lib/server/jiraClient';
import { json } from '@sveltejs/kit';
import dayjs from 'dayjs';
import type { RequestEvent } from './$types.js';

const getJql = (event: RequestEvent) => {
	const key = event.url.searchParams.get('key')?.split(',').join(', ');
	const days = Number(event.url.searchParams.get('days')) || 14;
	const task = event.url.searchParams.get('task')?.split(',').join(', ') || 'Task, Bug, Story';
	return `project in (${key}) AND issuetype in (${task}) AND (resolutiondate >= -${days}d OR createddate >= -${days}d)`;
};

export async function GET(event) {
	const jql = getJql(event);
	console.log(jql);

	try {
		const issues = await jc.issueSearch.searchForIssuesUsingJql({
			jql,
			maxResults: 1000
		});
		console.log(`Found ${issues.total} issues.`);

		const result: { [key: string]: { created: number; resolution: number } } = {};
		issues.issues?.forEach((issue) => {
			const c = dayjs(issue.fields.created).format('YYYY-MM-DD');
			const r = issue.fields.resolutiondate
				? dayjs(issue.fields.resolutiondate).format('YYYY-MM-DD')
				: null;
			result[`${c}`].created = result[`${c}`]?.created + 1 || 1;
			if (r) result[`${r}`].resolution = result[`${r}`]?.resolution + 1 || 1;
		});

		return json(result);
	} catch {
		console.log('Could not find project.');
		return json({ msg: 'Could not find project.', jql, success: false });
	}
}
