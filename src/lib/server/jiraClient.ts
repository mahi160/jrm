import { Version3Client } from 'jira.js';
// const id = 1;
// const user = db.select().from(users).where(eq(users.id, id)).get();

// const { host, email, apiToken } = user || {};

// const jira = async (
//   host?: string | null,
//   email?: string | null,
//   apiToken?: string | null
// ) => {
//   if (!host || !email || !apiToken) return;

// };

// export const jc = await jira(host, email, apiToken);

const host = process.env.SERVER_URL || '';
const email = process.env.EMAIL || '';
const apiToken = process.env.API_TOKEN || '';

export const jc = new Version3Client({
	host,
	authentication: {
		basic: {
			email,
			apiToken
		}
	}
});
