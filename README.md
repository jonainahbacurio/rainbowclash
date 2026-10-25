# Rainbow Clash
Accounts + global ranking need the Netlify function, so deploy with Git or the CLI (not drag-and-drop):
1. Push this folder to GitHub, then Netlify > Add site > Import from Git (publish dir `public`, auto-detected).
2. Or: `npm i -g netlify-cli && npm i && netlify deploy --prod`
3. Optional env var `AUTH_SECRET` (any long random text). Accounts and scores live in Netlify Blobs, no database setup.
Local test: `netlify dev`. If /api is unreachable the game runs in offline mode (this device only).
