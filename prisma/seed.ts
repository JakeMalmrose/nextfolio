import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create example users
  const user1 = await prisma.user.upsert({
    where: { email: 'jake.malmrose@gmail.com' },
    update: {},
    create: {
      email: 'jake.malmrose@gmail.com',
      name: 'Jake Malmrose',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })

  // Create example posts
  const post1 = await prisma.post.upsert({
    where: { id: 'example-post-1' },
    update: {},
    create: {
      id: 'example-post-1',
      title: 'Welcome to my Portfolio',
      content: 'This is an example blog post for the portfolio website.',
      published: true,
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.upsert({
    where: { id: 'example-post-2' },
    update: {},
    create: {
      id: 'example-post-2',
      title: 'Building with Next.js and Prisma',
      content: 'Here\'s how I set up this portfolio with modern web technologies.',
      published: false,
      authorId: user1.id,
    },
  })

  // Create some example analytics data
  await prisma.analytics.createMany({
    data: [
      {
        path: '/',
        userAgent: 'Mozilla/5.0 (example)',
        ip: '127.0.0.1',
        metadata: { source: 'seed' },
      },
      {
        path: '/projects',
        userAgent: 'Mozilla/5.0 (example)',
        ip: '127.0.0.1',
        metadata: { source: 'seed' },
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Database seeded successfully!')
  console.log({ user1, user2, post1, post2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })