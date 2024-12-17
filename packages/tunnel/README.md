# Tunnel

Wrap your commands with cloudflare DNS and tunnel.

### Installation

```
$ cd packages/tunnel
$ pnpm run setup
```

### Usage

1. Add `cloudflared` section to your `package.json`;

```json
"cloudflared": {
  "name": "yuzu-api-$USER",
  "hostname": "yuzu-api-$USER.r8edev.xyz",
  "target": "http://localhost:5173"
},
```

2. Prefix your dev script

```json
"scripts": {
  "dev": "tunnel vite dev"
}
```

3. Run it

```sh
$ pnpm run dev # ✅ Launched a tunnel https://yuzu-api-vp.r8edev.xyz -> http://localhost:5173
```
