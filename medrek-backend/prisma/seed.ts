const { PrismaClient } = require('../generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medrek.et' },
    update: {},
    create: {
      username: 'medrek_admin',
      email: 'admin@medrek.et',
      passwordHash: adminPassword,
      preferredLang: 'en',
      karma: 0,
    }
  })
  console.log('Admin user created:', admin.username)

  // 2. Create default communities
  const communities = [
    {
      name: 'Politics',
      nameAm: 'ፖለቲካ',
      description: 'Ethiopian politics, policy, and governance discussions.',
      descriptionAm: 'የኢትዮጵያ ፖለቲካ፣ ፖሊሲ እና አስተዳደር ውይይቶች።',
      type: 'public',
      isSensitive: true,
      rules: [
        { number: 1, text: 'No ethnic incitement or hate speech', textAm: 'ጥላቻ ንግግር አይፈቀድም' },
        { number: 2, text: 'Verify all claims with sources', textAm: 'ሁሉንም ዳኞች ያረጋግጡ' },
        { number: 3, text: 'Respect all ethnic groups equally', textAm: 'ሁሉንም ብሄሮች እኩል ያክብሩ' },
      ]
    },
    {
      name: 'Sports',
      nameAm: 'ስፖርት',
      description: 'Ethiopian sports, football, athletics and more.',
      descriptionAm: 'የኢትዮጵያ ስፖርት፣ እግር ኳስ፣ አትሌቲክስ እና ሌሎች።',
      type: 'public',
      isSensitive: false,
      rules: [
        { number: 1, text: 'No trash talk or personal attacks', textAm: 'ስድብ አይፈቀድም' },
        { number: 2, text: 'Share verified match results only', textAm: 'የተረጋገጡ ውጤቶች ብቻ' },
      ]
    },
    {
      name: 'Tech Ethiopia',
      nameAm: 'ቴክኖሎጂ',
      description: 'A community for Ethiopian tech enthusiasts, developers, startups, and anyone passionate about technology in Ethiopia.',
      descriptionAm: 'ለኢትዮጵያ የቴክኖሎጂ አፍቃሪዎች፣ ገንቢዎች፣ እና ስታርትአፕ ባለቤቶች ማህበረሰብ።',
      type: 'public',
      isSensitive: false,
      rules: [
        { number: 1, text: 'Post only tech-related content', textAm: 'የቴክኖሎጂ ይዘት ብቻ ይለጥፉ' },
        { number: 2, text: 'No spam or self-promotion without context', textAm: 'ያለ አውድ ማስታወቂያ አይፈቀድም' },
        { number: 3, text: 'Share sources for all claims', textAm: 'ለሁሉም ዳኞች ምንጭ ያቅርቡ' },
      ]
    },
    {
      name: 'Food & Culture',
      nameAm: 'ምግብና ባህል',
      description: 'Ethiopian food, recipes, traditions, art, and cultural discussions.',
      descriptionAm: 'የኢትዮጵያ ምግብ፣ የምግብ አሰራር፣ ባህል እና ጥበብ።',
      type: 'public',
      isSensitive: false,
      rules: [
        { number: 1, text: 'Keep discussions respectful and constructive', textAm: 'አክባሪ እና ገንቢ ይሁኑ' },
        { number: 2, text: 'No cultural disrespect or mockery', textAm: 'ባህልን ማቃለል አይፈቀድም' },
      ]
    },
    {
      name: 'Education',
      nameAm: 'ትምህርት',
      description: 'Ethiopian education, universities, scholarships and learning resources.',
      descriptionAm: 'የኢትዮጵያ ትምህርት፣ ዩኒቨርሲቲዎች፣ ስኮላርሺፕ እና የትምህርት ምንጮች።',
      type: 'public',
      isSensitive: false,
      rules: [
        { number: 1, text: 'Share verified information only', textAm: 'የተረጋገጠ መረጃ ብቻ' },
        { number: 2, text: 'Be helpful and supportive', textAm: 'ረዳት እና ደጋፊ ይሁኑ' },
      ]
    },
    {
      name: 'Business Ethiopia',
      nameAm: 'ንግድ',
      description: 'Ethiopian business, entrepreneurship, investment and economy.',
      descriptionAm: 'የኢትዮጵያ ንግድ፣ ስራ ፈጠራ፣ ኢንቨስትመንት እና ኢኮኖሚ።',
      type: 'public',
      isSensitive: false,
      rules: [
        { number: 1, text: 'No misleading business claims', textAm: 'አሳሳቹ የንግድ ዳኞች አይፈቀዱም' },
        { number: 2, text: 'Disclose conflicts of interest', textAm: 'የጥቅም ግጭቶችን ይግለጹ' },
      ]
    },
    {
      name: 'Diaspora',
      nameAm: 'ዲያስፖራ',
      description: 'For Ethiopians living abroad — connecting the diaspora community.',
      descriptionAm: 'በውጭ ለሚኖሩ ኢትዮጵያውያን — የዲያስፖራ ማህበረሰብ።',
      type: 'public',
      isSensitive: false,
      rules: [
        { number: 1, text: 'Respectful discussion of diaspora life', textAm: 'የዲያስፖራ ህይወት ውይይት' },
      ]
    },
  ]

  for (const comm of communities) {
    const { rules, ...communityData } = comm
    const created = await prisma.community.upsert({
      where: { name: comm.name },
      update: {},
      create: {
        ...communityData,
        creatorId: admin.id,
        memberCount: 0,
      }
    })

    // Create rules for this community
    for (const rule of rules) {
      await prisma.communityRule.upsert({
        where: { id: `${created.id}-rule-${rule.number}` },
        update: {},
        create: {
          id: `${created.id}-rule-${rule.number}`,
          communityId: created.id,
          number: rule.number,
          text: rule.text,
          textAm: rule.textAm,
        }
      })
    }

    console.log('Community created:', created.name)
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })