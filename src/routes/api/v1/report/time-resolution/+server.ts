import { jc } from '$lib/server/jiraClient';
import { countWeekends } from '$lib/utils.js';
import { json } from '@sveltejs/kit';
import dayjs from 'dayjs';

const host = process.env.SERVER_URL || '';
export async function GET(event) {
	const key = event.url.searchParams.get('key')?.split(',').join(', ');
	const start = event.url.searchParams.get('start');
	const end = event.url.searchParams.get('end');
	const task = event.url.searchParams.get('task')?.split(',').join(', ') || 'Task, Bug, Story';
	const jql = `project in (${key}) AND issuetype in (${task}) AND resolution = Done AND (resolutiondate >= ${start} AND resolutiondate <= ${end})`;
	console.log(jql);
	const numberOfWeekends = countWeekends(start as string, end as string);
	console.log(`Number of weekends: ${numberOfWeekends}`);

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
				days:
					dayjs(issue.fields.resolutiondate).diff(issue.fields.created, 'day') -
					countWeekends(issue.fields.created, issue.fields.resolutiondate as string) +
					1,
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
