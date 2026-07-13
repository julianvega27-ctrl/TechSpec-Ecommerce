# Copia de base de datos - TechSpec

Este directorio contiene una copia de respaldo de la base de datos PostgreSQL utilizada en el proyecto TechSpec.

## Archivo

- `techspec_backup.dump`: respaldo generado con `pg_dump` en formato custom.

## Restauración

Para restaurar la base de datos localmente:

```bash
createdb -h localhost -p 5432 -U postgres techspec_db
pg_restore -h localhost -p 5432 -U postgres -d techspec_db -v database/techspec_backup.dump