import { defineConfig } from 'prisma/config'
import path from 'node:path'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrate: {
    async development() {
      return {
        url: 'postgresql://postgres:postgres@localhost:5432/apple_shop',
      }
    },
  },
  datasource: {
    url: 'postgresql://postgres:postgres@localhost:5432/apple_shop',
  },
})
