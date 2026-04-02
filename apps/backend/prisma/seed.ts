import { PrismaClient, UserRole, CosmeticType, Visibility } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.transaction.deleteMany();
  await prisma.bitsBalance.deleteMany();
  await prisma.cosmeticItem.deleteMany();
  await prisma.avatar.deleteMany();
  await prisma.world.deleteMany();
  await prisma.report.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for all users (Demo1234)
  const passwordHash = await bcrypt.hash('Demo1234', 10);

  // 1. Create Admin User
  console.log('👑 Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@avatar3d.dev',
      passwordHash,
      displayName: 'Platform Admin',
      role: UserRole.ADMIN,
      locale: 'de',
      isVerified: true,
    },
  });

  // Create bits balance for admin
  await prisma.bitsBalance.create({
    data: {
      userId: admin.id,
      balance: 10000,
    },
  });

  // 2. Create 5 Test Users
  console.log('👥 Creating test users...');
  const testUsers = [];
  
  const userNames = [
    { name: 'Max Mustermann', email: 'max@test.de', locale: 'de' },
    { name: 'Anna Schmidt', email: 'anna@test.de', locale: 'de' },
    { name: 'John Doe', email: 'john@test.com', locale: 'en' },
    { name: 'Emma Wilson', email: 'emma@test.com', locale: 'en' },
    { name: 'Sophie Müller', email: 'sophie@test.de', locale: 'de' },
  ];

  for (const userData of userNames) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        displayName: userData.name,
        role: UserRole.CREATOR,
        locale: userData.locale,
        isVerified: true,
      },
    });
    testUsers.push(user);

    // Create bits balance (100 Bits for new users)
    await prisma.bitsBalance.create({
      data: {
        userId: user.id,
        balance: 100,
      },
    });
  }

  console.log(`✅ Created ${testUsers.length} test users`);

  // 3. Create 2 Sample Low-Poly Avatars for each user
  console.log('🎭 Creating sample avatars...');
  let avatarCount = 0;

  const avatarTemplates = [
    {
      name: 'Klassischer Avatar',
      baseModelUrl: 'https://cdn.avatar3d.dev/models/default-humanoid.glb',
      customization: {
        skinColor: '#FFD1A3',
        height: 1.0,
        proportions: { head: 1.0, body: 1.0, limbs: 1.0 },
      },
    },
    {
      name: 'Roboter Avatar',
      baseModelUrl: 'https://cdn.avatar3d.dev/models/robot-base.glb',
      customization: {
        primaryColor: '#4A90E2',
        secondaryColor: '#E94B3C',
        metallicEffect: 0.8,
      },
    },
  ];

  for (const user of testUsers) {
    for (let i = 0; i < avatarTemplates.length; i++) {
      const template = avatarTemplates[i];
      const isActive = i === 0; // First avatar is active

      await prisma.avatar.create({
        data: {
          ownerId: user.id,
          name: template.name,
          baseModelUrl: template.baseModelUrl,
          thumbnailUrl: `https://cdn.avatar3d.dev/thumbnails/avatar-${i + 1}.png`,
          customization: template.customization,
          equippedItems: [],
          isActive,
        },
      });
      avatarCount++;
    }
  }

  console.log(`✅ Created ${avatarCount} avatars`);

  // 4. Create 10 Sample Cosmetic Items
  console.log('✨ Creating sample cosmetics...');
  const cosmetics = [
    {
      name: 'Coole Sonnenbrille',
      description: 'Stylische Sonnenbrille im Low-Poly-Stil',
      type: CosmeticType.ACCESSORY,
      priceBits: 50,
      metadata: { attachmentPoint: 'head', category: 'eyewear' },
    },
    {
      name: 'Baseball Cap',
      description: 'Klassische Baseballkappe',
      type: CosmeticType.ACCESSORY,
      priceBits: 30,
      metadata: { attachmentPoint: 'head', category: 'hat' },
    },
    {
      name: 'Spiky Hair',
      description: 'Wilde stachelige Frisur',
      type: CosmeticType.HAIR,
      priceBits: 40,
      metadata: { attachmentPoint: 'head', morphTargets: ['spiky'] },
    },
    {
      name: 'Roboter Kopf',
      description: 'Futuristischer Roboterkopf',
      type: CosmeticType.HEAD,
      priceBits: 150,
      metadata: { fullReplacement: true, animated: true },
    },
    {
      name: 'Superhelden-Cape',
      description: 'Episches Cape mit Physik-Simulation',
      type: CosmeticType.OUTFIT,
      priceBits: 200,
      metadata: { attachmentPoint: 'back', hasPhysics: true },
    },
    {
      name: 'Neon-Augen',
      description: 'Leuchtende Neon-Augen',
      type: CosmeticType.EYES,
      priceBits: 60,
      metadata: { emissive: true, color: '#00FF00' },
    },
    {
      name: 'Cyber-Anzug',
      description: 'Futuristischer Ganzkörperanzug',
      type: CosmeticType.OUTFIT,
      priceBits: 250,
      metadata: { fullBody: true, animated: true },
    },
    {
      name: 'Tanzen Animation',
      description: 'Coole Tanz-Animation',
      type: CosmeticType.ANIMATION,
      priceBits: 100,
      metadata: { duration: 5.0, loop: true },
    },
    {
      name: 'Goldene Haut',
      description: 'Glänzender Goldeffekt',
      type: CosmeticType.SKIN,
      priceBits: 300,
      metadata: { metallic: 1.0, color: '#FFD700' },
    },
    {
      name: 'Skateboard',
      description: 'Fahrbares Skateboard',
      type: CosmeticType.ACCESSORY,
      priceBits: 120,
      metadata: { attachmentPoint: 'feet', hasAnimation: true },
    },
  ];

  let cosmeticCount = 0;
  for (const cosmeticData of cosmetics) {
    const owner = testUsers[cosmeticCount % testUsers.length];
    await prisma.cosmeticItem.create({
      data: {
        ownerId: owner.id,
        name: cosmeticData.name,
        description: cosmeticData.description,
        type: cosmeticData.type,
        assetUrl: `https://cdn.avatar3d.dev/cosmetics/${cosmeticData.name.toLowerCase().replace(/\s+/g, '-')}.glb`,
        previewThumbnail: `https://cdn.avatar3d.dev/thumbnails/${cosmeticData.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        priceBits: cosmeticData.priceBits,
        isForSale: true,
        isApproved: true,
        metadata: cosmeticData.metadata,
      },
    });
    cosmeticCount++;
  }

  console.log(`✅ Created ${cosmeticCount} cosmetic items`);

  // 5. Create 2 Sample Worlds
  console.log('🌍 Creating sample worlds...');
  await prisma.world.create({
    data: {
      ownerId: testUsers[0].id,
      name: 'Meine erste Welt',
      description: 'Eine einfache Testwelt mit Plattformen',
      sceneJSON: {
        version: '1.0',
        environment: {
          skybox: 'default',
          lighting: 'day',
          fog: { enabled: false },
        },
        objects: [
          {
            id: 'ground-1',
            type: 'plane',
            position: [0, 0, 0],
            scale: [20, 1, 20],
            material: { color: '#90EE90', texture: 'grass' },
          },
          {
            id: 'platform-1',
            type: 'box',
            position: [0, 1, 0],
            scale: [5, 0.5, 5],
            material: { color: '#8B4513', texture: 'wood' },
          },
        ],
        spawnPoints: [{ position: [0, 2, 0], rotation: [0, 0, 0] }],
      },
      thumbnailUrl: 'https://cdn.avatar3d.dev/thumbnails/world-1.png',
      visibility: Visibility.PUBLIC,
      isApproved: true,
    },
  });

  await prisma.world.create({
    data: {
      ownerId: testUsers[1].id,
      name: 'Cyber City',
      description: 'Futuristische Stadt im Neon-Stil',
      sceneJSON: {
        version: '1.0',
        environment: {
          skybox: 'night',
          lighting: 'neon',
          fog: { enabled: true, color: '#8B00FF', density: 0.01 },
        },
        objects: [
          {
            id: 'ground-1',
            type: 'plane',
            position: [0, 0, 0],
            scale: [50, 1, 50],
            material: { color: '#1a1a2e', emissive: '#0f0f1e' },
          },
          {
            id: 'building-1',
            type: 'box',
            position: [5, 5, 5],
            scale: [3, 10, 3],
            material: { color: '#4A90E2', emissive: '#00FFFF' },
          },
        ],
        spawnPoints: [{ position: [0, 1, 0], rotation: [0, Math.PI / 4, 0] }],
      },
      thumbnailUrl: 'https://cdn.avatar3d.dev/thumbnails/world-2.png',
      visibility: Visibility.PUBLIC,
      isApproved: true,
    },
  });

  console.log('✅ Created 2 sample worlds');

  // 6. Create a sample transaction
  console.log('💰 Creating sample transaction...');
  await prisma.transaction.create({
    data: {
      fromUserId: null, // Platform gift
      toUserId: testUsers[0].id,
      amountBits: 100,
      type: 'PLATFORM_REWARD',
      status: 'COMPLETED',
      platformFee: 0,
    },
  });

  console.log('✅ Database seeded successfully! 🎉');
  console.log('\n📋 Summary:');
  console.log(`   - 1 Admin user (admin@avatar3d.dev / Demo1234)`);
  console.log(`   - 5 Test users (Demo1234 password)`);
  console.log(`   - ${avatarCount} Sample avatars`);
  console.log(`   - ${cosmeticCount} Cosmetic items`);
  console.log(`   - 2 Sample worlds`);
  console.log(`   - All users have Bits balances\n`);
  console.log('🎮 Test user logins:');
  userNames.forEach(u => console.log(`   - ${u.email} / Demo1234`));
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
