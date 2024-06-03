import { jc } from '$lib/server/jiraClient';
import { json } from '@sveltejs/kit';

export async function GET() {
	const issueTypes = (await jc.issueTypes.getIssueAllTypes()).map((i) => i.name);
	const result = ([...new Set(issueTypes)] as string[]).sort((a, b) => (a < b ? -1 : 1));
	return json(result);
}
