#USUARIOS

## ADMIN
Email: admin@techspec.com
Password: adminpassword



schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}