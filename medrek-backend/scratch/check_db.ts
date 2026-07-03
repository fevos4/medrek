const { prisma } = require('../src/lib/prisma')

async function check() {
  try {
    console.log('Testing communities query...')
    const comms = await prisma.community.findMany({
      take: 2,
      include: { rules: true, _count: { select: { members: true } } },
      orderBy: { memberCount: 'desc' }
    })
    console.log('SUCCESS - count:', comms.length)
    console.log(JSON.stringify(comms[0], null, 2))
  } catch(err: any) {
    console.error('DB ERROR:', err.message)
    console.error('CODE:', err.code)
    console.error('META:', JSON.stringify(err.meta))
  }

  try {
    console.log('\nTesting my-moderated query...')
    const memberships = await prisma.communityMember.findMany({
      where: {
        userId: 'test-user-id',
        role: { in: ['moderator', 'admin'] }
      },
      include: {
        community: { select: { id: true, name: true, nameAm: true, memberCount: true } }
      }
    })
    console.log('my-moderated SUCCESS - count:', memberships.length)
  } catch(err: any) {
    console.error('my-moderated DB ERROR:', err.message)
  }

  await (prisma as any)['$disconnect']()
}

check()
