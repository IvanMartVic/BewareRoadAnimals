import "dotenv/config"
// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const connectionString = `${process.env.PRISMA_DATABASE_URL}`;

const adapter = new PrismaPg({
    connectionString,
})

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export {prisma}
