# Clipboard Sync Relay

Simple WebSocket relay server for syncing clipboard between 2 Windows machines.

## Deploy to Render (Free Tier)

1. Create a new public GitHub repo and push this folder into it (or the whole project).
2. Go to [render.com](https://render.com) → Sign up with GitHub.
3. New → Web Service → Connect your repo.
4. Settings:
   - Name: `clipboard-sync-relay` (or anything)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**
5. Environment Variables (add these):
   - `SYNC_KEY` = your secret key (e.g. `my-super-secret-clipboard-2026`)
6. Deploy.

After deploy, Render will give you a URL like `https://clipboard-sync-relay.onrender.com`.

The WebSocket URL will be: `wss://clipboard-sync-relay.onrender.com?room=myroom&key=your-sync-key`

**Note**: Free tier spins down after 15 minutes of no traffic. First connection after idle takes ~30-60 seconds. Keep the app running on both machines to minimize this.

## Local test

```bash
npm install
SYNC_KEY=test npm start
```
