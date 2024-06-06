import { jc } from '$lib/server/jiraClient';
import { json } from '@sveltejs/kit';
import dayjs from 'dayjs';
import type { RequestEvent } from './$types.js';

const getJql = (event: RequestEvent) => {
	const key = event.url.searchParams.get('key')?.split(',').join(', ');
	const start = event.url.searchParams.get('start');
	const end = event.url.searchParams.get('end');

	const task = event.url.searchParams.get('task')?.split(',').join(', ') || 'Task, Bug, Story';
	return `project in (${key}) AND issuetype in (${task}) AND (created >= ${start} AND created <= ${end}) OR (resolutiondate >= ${start} AND resolutiondate <= ${end})`;
};

export async function GET(event) {
	const start = event.url.searchParams.get('start');
	const end = event.url.searchParams.get('end');
	const jql = getJql(event);
	console.log(jql);

	try {
		const issues = await jc.issueSearch.searchForIssuesUsingJql({
			jql,
			maxResults: 1000
		});
		console.log(`Found ${issues.total} issues.`);
		const result = issues.issues
			?.map((issue) => ({
				key: issue.key,
				url: `${process.env.JIRA_URL}/browse/${issue.key}`,
				title: issue.fields.summary,
				assignee: issue.fields.assignee?.displayName,
				status: issue.fields.status.name,
				priority: issue.fields.priority?.name,
				updated: issue.fields.resolutiondate ? issue.fields.resolutiondate : null,
				created: issue.fields.created
			}))
			.filter(
				(issue) =>
					dayjs(issue.created).isAfter(dayjs(start), 'day') &&
					dayjs(issue.created).isBefore(dayjs(end), 'day')
			);

		return json(result);
	} catch {
		console.log('Could not find project.');
		return json({ msg: 'Could not find project.', jql, success: false });
	}
}
