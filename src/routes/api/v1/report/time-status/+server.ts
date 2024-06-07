import { jc } from '$lib/server/jiraClient';
import { json, type RequestHandler } from '@sveltejs/kit';
import dayjs from 'dayjs';
const host = process.env.SERVER_URL || '';

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
						issueType: issue.fields.issuetype?.name,
						url: `${host}/browse/${issue.key}`
					}));
			});
		});
		const filteredLog = log.map((entry) => ({
			...entry,
			workingTimeInSeconds: calculateWorkingTime(entry.timestamp)
		}));
		return json(filteredLog);
	} catch (error) {
		console.error('Error fetching issues:', error);
		return json({ msg: 'Could not find project.', success: false });
	}
};

const WORKING_HOURS_START = 9; // 9 AM
const WORKING_HOURS_END = 17; // 5 PM
const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
function calculateWorkingTime(timestamp?: string) {
	const date = dayjs(timestamp);
	const day = date.day();
	const hour = date.hour();

	if (!WORKING_DAYS.includes(day) || hour < WORKING_HOURS_START || hour >= WORKING_HOURS_END) {
		return 0;
	}

	const startOfWork = date.startOf('day').add(WORKING_HOURS_START, 'hour');
	const endOfWork = date.startOf('day').add(WORKING_HOURS_END, 'hour');

	const workingTime =
		Math.min(endOfWork.unix(), date.unix()) - Math.max(startOfWork.unix(), date.unix());
	return workingTime > 0 ? workingTime : 0;
}
