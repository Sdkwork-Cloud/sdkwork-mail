# Mail Database Module

Canonical lifecycle assets for `sdkwork-mail` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `Mail`
- serviceCode: `Mail`
- tablePrefix: `mail_`

## Commands

```bash
pnpm run db:materialize:contract
pnpm run db:validate
```

Legacy SQL: `crates/sdkwork-communication-mail-repository-sqlx/src/schema/postgres_Mail.sql` → `database/ddl/baseline/postgres/0001_mail_legacy_baseline.sql`

Runtime bootstrap: `sdkwork-mail-database-host` via `persistence_from_database_pool()` on Postgres; SQLite continues inline schema apply.
