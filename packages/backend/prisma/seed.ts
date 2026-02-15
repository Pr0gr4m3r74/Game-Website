import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('Demo1234', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@playverse.com' },
    update: {},
    create: {
      email: 'alice@playverse.com',
      username: 'alice_gamer',
      displayName: 'Alice',
      password: hashedPassword,
      bio: 'Love playing social games!',
      level: 5,
      experience: 2500,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@playverse.com' },
    update: {},
    create: {
      email: 'bob@playverse.com',
      username: 'bob_builder',
      displayName: 'Bob',
      password: hashedPassword,
      bio: 'Building awesome worlds!',
      level: 3,
      experience: 900,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'charlie@playverse.com' },
    update: {},
    create: {
      email: 'charlie@playverse.com',
      username: 'charlie_pro',
      displayName: 'Charlie',
      password: hashedPassword,
      level: 7,
      experience: 4900,
    },
  });

  console.log('Created users:', { user1, user2, user3 });

  // Create achievements
  const achievement1 = await prisma.achievement.upsert({
    where: { name: 'First Steps' },
    update: {},
    create: {
      name: 'First Steps',
      description: 'Complete your first game',
      icon: '🎮',
    },
  });

  const achievement2 = await prisma.achievement.upsert({
    where: { name: 'Social Butterfly' },
    update: {},
    create: {
      name: 'Social Butterfly',
      description: 'Make 10 friends',
      icon: '🦋',
    },
  });

  const achievement3 = await prisma.achievement.upsert({
    where: { name: 'Level Master' },
    update: {},
    create: {
      name: 'Level Master',
      description: 'Reach level 10',
      icon: '⭐',
    },
  });

  console.log('Created achievements:', { achievement1, achievement2, achievement3 });

  // Grant achievements to users
  await prisma.userAchievement.upsert({
    where: {
      userId_achievementId: {
        userId: user1.id,
        achievementId: achievement1.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      achievementId: achievement1.id,
    },
  });

  // Create friend relationships
  await prisma.friend.upsert({
    where: {
      userId_friendId: {
        userId: user1.id,
        friendId: user2.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      friendId: user2.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.friend.upsert({
    where: {
      userId_friendId: {
        userId: user1.id,
        friendId: user3.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      friendId: user3.id,
      status: 'ACCEPTED',
    },
  });

  // Create a sample game
  const game = await prisma.game.create({
    data: {
      name: 'Creative Sandbox',
      description: 'Build and explore together!',
      maxPlayers: 4,
      currentPlayers: 2,
      status: 'IN_PROGRESS',
      createdById: user1.id,
      participants: {
        create: [
          { userId: user1.id, score: 150 },
          { userId: user2.id, score: 120 },
        ],
      },
    },
  });

  console.log('Created game:', game);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
