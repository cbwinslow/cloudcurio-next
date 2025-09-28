export async function ghFetch<T = any>(query: string, variables: Record<string, any> = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('Missing GITHUB_TOKEN');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  return res.json() as Promise<T>;
}

export const queries = {
  repos: `query($login:String!){
    user(login:$login){
      repositories(first:12, orderBy:{field:UPDATED_AT, direction:DESC}){
        nodes{ name description stargazerCount forkCount url updatedAt primaryLanguage{ name } }
      }
    }
  }`,
  pulls: `query($login:String!){
    user(login:$login){
      pullRequests(first:10, orderBy:{field:UPDATED_AT, direction:DESC}){
        nodes{ title url state repository{name} updatedAt }
      }
    }
  }`,
  actions: `query($login:String!){
    user(login:$login){
      repositories(first:10, orderBy:{field:UPDATED_AT, direction:DESC}){
        nodes{ name url defaultBranchRef{ name } }
      }
    }
  }`
}
