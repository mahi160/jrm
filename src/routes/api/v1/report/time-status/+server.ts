import { jc } from '$lib/server/jiraClient';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	try {
		const key = event.url.searchParams.get('key')?.split(',').join(', ');
		const start = event.url.searchParams.get('start');
		const end = event.url.searchParams.get('end');
		const task = event.url.searchParams.get('task')?.split(',').join(', ') || 'Task, Bug, Story';

		if (!key || !start || !end) {
			return json({ msg: 'Missing required query parameters.', success: false });
		}

		const jql = `project in (${key}) AND issuetype in (${task}) AND (updated >= ${start} AND updated <= ${end})`;
		console.log(jql);

		const issuesResponse = await jc.issueSearch.searchForIssuesUsingJql({
			jql,
			maxResults: 1000,
			expand: 'changelog'
		});

		const { issues = [], total = 0 } = issuesResponse;
		console.log(`Found ${total} issues.`);

		if (issues.length === 0) {
			return json({ msg: 'No issues found.', jql, success: false });
		}

		const log = issues.flatMap((issue) => {
			const histories = issue.changelog?.histories || [];
			return histories.flatMap((history) => {
				const items = history.items || [];
				return items
					.filter((item) => item.field === 'status')
					.map((item) => ({
						key: issue.key,
						timestamp: history['created'],
						from: item['fromString'],
						to: item['toString'],
						issueType: issue.fields.issuetype?.name
					}));
			});
		});

		return json(log);
	} catch (error) {
		console.error('Error fetching issues:', error);
		return json({ msg: 'Could not find project.', success: false });
	}
};
