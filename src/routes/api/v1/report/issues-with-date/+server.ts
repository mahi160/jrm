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
		const result =
			issues.issues?.map((issue) => ({
				key: issue.key,
				url: `${process.env.JIRA_URL}/browse/${issue.key}`,
				title: issue.fields.summary,
				assignee: issue.fields.assignee?.displayName,
				status: issue.fields.status.name,
				priority: issue.fields.priority?.name,
				updated: issue.fields.resolutiondate
					? dayjs(issue.fields.resolutiondate).format('YYYY-MM-DD')
					: null,
				created: dayjs(issue.fields.created).format('YYYY-MM-DD')
			})) || [];

		return json(result);
	} catch {
		console.log('Could not find project.');
		return json({ msg: 'Could not find project.', jql, success: false });
	}
}
