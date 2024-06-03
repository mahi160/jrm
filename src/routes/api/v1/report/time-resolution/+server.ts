import { jc } from '$lib/server/jiraClient';
import { json } from '@sveltejs/kit';
import dayjs from 'dayjs';

const host = process.env.SERVER_URL || '';
export async function GET(event) {
	const key = event.url.searchParams.get('key')?.split(',').join(', ');
	const days = Number(event.url.searchParams.get('days')) || 14;
	const task = event.url.searchParams.get('task')?.split(',').join(', ') || 'Task, Bug, Story';
	const jql = `project in (${key}) AND issuetype in (${task}) AND resolution = Done AND resolutiondate >= -${days}d`;
	console.log(jql);

	try {
		const issues = await jc.issueSearch.searchForIssuesUsingJql({
			jql,
			maxResults: 1000
		});
		console.log(`Found ${issues.total} issues.`);
		const result = issues.issues
			?.map((issue) => ({
				id: issue.key,
				summary: issue.fields.summary,
				days: dayjs(issue.fields.resolutiondate).diff(issue.fields.created, 'day'),
				type: issue.fields.issuetype?.name,
				resolutionDate: issue.fields.resolutiondate,
				createdDate: issue.fields.created,
				url: `${host}/browse/${issue.key}`
			}))
			.sort((a, b) => a.days - b.days);

		return json(result);
	} catch {
		console.log('Could not find project.');
		return json({ msg: 'Could not find project.', jql, success: false });
	}
}
