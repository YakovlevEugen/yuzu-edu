# Yuzu EDU (and Arbirtrum One) Indexer

## Parallel Backfill

```sh
$ pnpm trigger:parallel:workflow "{ \"shardId\": 0 }"
$ pnpm trigger:parallel:workflow "{ \"shardId\": 1 }"
$ pnpm trigger:parallel:workflow "{ \"shardId\": 2 }"
$ pnpm trigger:parallel:workflow "{ \"shardId\": 3 }"
$ pnpm trigger:parallel:workflow "{ \"shardId\": 4 }"
```