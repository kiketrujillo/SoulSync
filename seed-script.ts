// src/db/seed.ts
import prisma from './prisma';
import { hash } from '../utils/encrypt';

async function main() {
  console.log('🌱 Starting to seed database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.moonCircleMember.deleteMany({});
  await prisma.moonCircle.deleteMany({});
  await prisma.skillTreeProgress.deleteMany({});
  await prisma.questProgress.deleteMany({});
  await prisma.skillTree.deleteMany({});
  await prisma.quest.deleteMany({});
  await prisma.ritual.deleteMany({});
  await prisma.tarotCard.deleteMany({});
  // Keep users for development - would clear in production reset
  // await prisma.user.deleteMany({});

  // Seed Tarot Cards (just a few examples for brevity)
  console.log('Seeding tarot cards...');
  const tarotCards = [
    {
      name: 'The Fool',
      arcana: 'Major',
      imageUrl: '/images/tarot/major/fool.jpg',
      upright: 'New beginnings, innocence, adventure',
      reversed: 'Recklessness, risk-taking, foolishness',
      description: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe.',
      keywords: ['beginnings', 'innocence', 'adventure', 'wonder']
    },
    {
      name: 'The Magician',
      arcana: 'Major',
      imageUrl: '/images/tarot/major/magician.jpg',
      upright: 'Manifestation, resourcefulness, power, inspired action',
      reversed: 'Manipulation, poor planning, untapped talents',
      description: 'The Magician represents manifestation, inspired action, having the tools to create, and the alchemy of materials on earth.',
      keywords: ['manifestation', 'power', 'action', 'creation']
    },
    {
      name: 'The High Priestess',
      arcana: 'Major',
      imageUrl: '/images/tarot/major/high-priestess.jpg',
      upright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind',
      reversed: 'Secrets, disconnected from intuition, withdrawal and silence',
      description: 'The High Priestess represents secrets, mystery, intuition, wisdom, making the impossible possible, and magic.',
      keywords: ['intuition', 'mystery', 'spirituality', 'inner voice']
    },
    {
      name: 'Ace of Cups',
      arcana: 'Minor',
      suit: 'Cups',
      imageUrl: '/images/tarot/cups/ace.jpg',
      upright: 'New feelings, emotional awakening, creativity, intuition',
      reversed: 'Emotional loss, blocked creativity, emptiness',
      description: 'The Ace of Cups represents a new beginning with the potential for deep emotional fulfillment and joy.',
      keywords: ['love', 'new emotions', 'intuition', 'creative flow']
    },
    {
      name: 'Queen of Wands',
      arcana: 'Minor',
      suit: 'Wands',
      imageUrl: '/images/tarot/wands/queen.jpg',
      upright: 'Courage, confidence, independence, social butterfly',
      reversed: 'Self-doubt, jealousy, insecurity, dependency',
      description: 'The Queen of Wands represents courage, determination, joy, and someone who is trustworthy and passionate.',
      keywords: ['courage', 'confidence', 'passion', 'determination']
    }
  ];

  for (const card of tarotCards) {
    await prisma.tarotCard.create({
      data: card
    });
  }

  // Seed Rituals
  console.log('Seeding rituals...');
  const rituals = [
    {
      name: 'New Moon Intention Setting',
      description: 'A ritual to set intentions at the new moon for the upcoming lunar cycle.',
      duration: 20,
      moonPhase: 'New Moon',
      element: 'Water',
      targetMood: 'Reflective',
      steps: JSON.stringify([
        { step: 1, name: 'Prepare sacred space', description: 'Find a quiet space and light a candle.' },
        { step: 2, name: 'Cleansing', description: 'Burn sage or palo santo to clear the energy.' },
        { step: 3, name: 'Meditation', description: 'Sit quietly for 5 minutes, focusing on your breath.' },
        { step: 4, name: 'Writing intentions', description: 'Write down 3-5 intentions for this moon cycle.' },
        { step: 5, name: 'Visualization', description: 'Visualize your intentions manifesting fully.' },
        { step: 6, name: 'Gratitude', description: 'Close with gratitude for what is and what will be.' }
      ])
    },
    {
      name: 'Full Moon Release',
      description: 'A ritual to release what no longer serves you during the full moon.',
      duration: 30,
      moonPhase: 'Full Moon',
      element: 'Fire',
      targetMood: 'Emotional',
      steps: JSON.stringify([
        { step: 1, name: 'Prepare sacred space', description: 'Find a quiet space and light a white candle.' },
        { step: 2, name: 'Cleansing', description: 'Take a salt bath or shower with the intention to cleanse.' },
        { step: 3, name: 'Reflection', description: 'Reflect on what you need to release.' },
        { step: 4, name: 'Writing', description: 'Write down what you wish to release on paper.' },
        { step: 5, name: 'Release ceremony', description: 'Safely burn the paper (or tear it up) while stating your release.' },
        { step: 6, name: 'Gratitude', description: 'Express gratitude for the lessons learned.' }
      ])
    },
    {
      name: 'Mercury Retrograde Protection',
      description: 'A ritual to protect yourself during Mercury Retrograde periods.',
      duration: 15,
      cosmicEvent: 'Mercury Retrograde',
      element: 'Air',
      targetMood: 'Anxious',
      steps: JSON.stringify([
        { step: 1, name: 'Prepare space', description: 'Set up a quiet space with blue candle and clear quartz.' },
        { step: 2, name: 'Grounding', description: 'Take 3 deep breaths to center yourself.' },
        { step: 3, name: 'Protection visualization', description: 'Visualize a blue shield of light surrounding you.' },
        { step: 4, name: 'Affirmations', description: 'Repeat affirmations about clear communication.' },
        { step: 5, name: 'Close', description: 'Express gratitude and trust in your protection.' }
      ])
    },
    {
      name: 'Morning Alignment',
      description: 'A daily ritual to align with your highest self and cosmic energies.',
      duration: 10,
      moonPhase: null,
      element: 'All',
      targetMood: 'Sleepy',
      steps: JSON.stringify([
        { step: 1, name: 'Breathwork', description: 'Take 10 deep breaths upon waking.' },
        { step: 2, name: 'Gratitude', description: 'List 3 things you're grateful for.' },
        { step: 3, name: 'Intention', description: 'Set one clear intention for the day.' },
        { step: 4, name: 'Visualization', description: 'Visualize your day unfolding perfectly.' },
        { step: 5, name: 'Close', description: 'Place your hands on your heart and bow to yourself.' }
      ])
    }
  ];

  for (const ritual of rituals) {
    await prisma.ritual.create({
      data: ritual
    });
  }

  // Seed Skill Tree
  console.log('Seeding skill tree...');
  
  // Create parent skills first
  const astrology = await prisma.skillTree.create({
    data: {
      name: 'Astrology Basics',
      description: 'Learn the fundamental concepts of astrology including planets, signs, and houses.',
      category: 'Astrology',
      level: 1,
      imageUrl: '/images/skills/astrology_basics.jpg'
    }
  });

  const tarot = await prisma.skillTree.create({
    data: {
      name: 'Tarot Fundamentals',
      description: 'Understand the structure of the tarot deck and basic card meanings.',
      category: 'Tarot',
      level: 1,
      imageUrl: '/images/skills/tarot_fundamentals.jpg'
    }
  });

  const kabbalah = await prisma.skillTree.create({
    data: {
      name: 'Kabbalah Introduction',
      description: 'An introduction to the Tree of Life and basic Kabbalistic concepts.',
      category: 'Kabbalah',
      level: 1,
      imageUrl: '/images/skills/kabbalah_intro.jpg'
    }
  });

  // Create child skills that reference parent skills
  await prisma.skillTree.createMany({
    data: [
      {
        name: 'Planetary Meanings',
        description: 'Deep dive into the meanings and influences of the planets in astrology.',
        category: 'Astrology',
        level: 2,
        parentId: astrology.id,
        imageUrl: '/images/skills/planetary_meanings.jpg'
      },
      {
        name: 'Zodiac Signs',
        description: 'Understand the traits and energies of the twelve zodiac signs.',
        category: 'Astrology',
        level: 2,
        parentId: astrology.id,
        imageUrl: '/images/skills/zodiac_signs.jpg'
      },
      {
        name: 'Houses System',
        description: 'Learn about the twelve houses and their significance in a birth chart.',
        category: 'Astrology',
        level: 2,
        parentId: astrology.id,
        imageUrl: '/images/skills/houses_system.jpg'
      },
      {
        name: 'Major Arcana',
        description: 'Explore the 22 major arcana cards and their profound spiritual lessons.',
        category: 'Tarot',
        level: 2,
        parentId: tarot.id,
        imageUrl: '/images/skills/major_arcana.jpg'
      },
      {
        name: 'Minor Arcana',
        description: 'Master the 56 minor arcana cards and their practical guidance.',
        category: 'Tarot',
        level: 2,
        parentId: tarot.id,
        imageUrl: '/images/skills/minor_arcana.jpg'
      },
      {
        name: 'Tarot Spreads',
        description: 'Learn various tarot spreads for different questions and situations.',
        category: 'Tarot',
        level: 2,
        parentId: tarot.id,
        imageUrl: '/images/skills/tarot_spreads.jpg'
      },
      {
        name: 'Sefirot Study',
        description: 'Detailed study of the ten Sefirot (emanations) on the Tree of Life.',
        category: 'Kabbalah',
        level: 2,
        parentId: kabbalah.id,
        imageUrl: '/images/skills/sefirot_study.jpg'
      },
      {
        name: 'Tree Paths',
        description: 'Understand the 22 paths connecting the Sefirot on the Tree of Life.',
        category: 'Kabbalah',
        level: 2,
        parentId: kabbalah.id,
        imageUrl: '/images/skills/tree_paths.jpg'
      }
    ]
  });

  // Seed Quests
  console.log('Seeding quests...');
  const quests = [
    {
      name: 'New Moon Intentions',
      description: 'Set intentions for the lunar cycle and track their manifestation.',
      duration: 30, // days
      cosmicEvent: 'New Moon',
      steps: JSON.stringify([
        { step: 1, name: 'Reflection', description: 'Reflect on your desires for this moon cycle.' },
        { step: 2, name: 'Intention Setting', description: 'Write down 3-5 clear intentions.' },
        { step: 3, name: 'New Moon Ritual', description: 'Complete the New Moon Intention Setting ritual.' },
        { step: 4, name: 'First Quarter Check-in', description: 'Assess progress at the First Quarter Moon.' },
        { step: 5, name: 'Full Moon Amplification', description: 'Perform a ritual to amplify your intentions.' },
        { step: 6, name: 'Final Reflection', description: 'Reflect on your manifested intentions at the end of the cycle.' }
      ]),
      rewards: 'Astrology Basics skill progress +10%, Emotional awareness +5'
    },
    {
      name: 'Daily Tarot',
      description: 'Pull one tarot card each morning for a week and journal about its guidance.',
      duration: 7, // days
      cosmicEvent: 'Daily Practice',
      steps: JSON.stringify([
        { step: 1, name: 'Learn the Basics', description: 'Read the introduction to daily tarot draws.' },
        { step: 2, name: 'First Draw', description: 'Draw your first card and reflect on its meaning.' },
        { step: 3, name: 'Continue the Practice', description: 'Draw a card each day for the next 5 days.' },
        { step: 4, name: 'Final Reflection', description: 'Review your journal and notice patterns.' }
      ]),
      rewards: 'Tarot Fundamentals skill progress +15%, Intuition +3'
    },
    {
      name: 'Planetary Hours',
      description: 'Learn about planetary hours and plan activities according to their energies.',
      duration: 14, // days
      cosmicEvent: 'Planetary Alignment',
      steps: JSON.stringify([
        { step: 1, name: 'Study', description: 'Learn about the planetary hours system.' },
        { step: 2, name: 'Tracking', description: 'Note the planetary hour 3 times each day for a week.' },
        { step: 3, name: 'Alignment', description: 'Align one activity with its corresponding planetary hour.' },
        { step: 4, name: 'Integration', description: 'Plan a full day according to planetary hours.' },
        { step: 5, name: 'Reflection', description: 'Journal about your experience with planetary timing.' }
      ]),
      rewards: 'Planetary Meanings skill progress +20%, Cosmic alignment +7'
    }
  ];

  for (const quest of quests) {
    await prisma.quest.create({
      data: quest
    });
  }

  // Create a test user if needed
  if (process.env.CREATE_TEST_USER === 'true') {
    console.log('Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { email: 'test@soulsync.app' },
      update: {},
      create: {
        email: 'test@soulsync.app',
        password: await hash('password123'),
        birthDate: new Date('1990-06-15'),
        birthTime: '14:30',
        birthPlace: 'New York, NY',
        zodiacSign: 'Gemini',
        element: 'Air'
      }
    });
    
    console.log(`Test user created with ID: ${testUser.id}`);
  }

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
