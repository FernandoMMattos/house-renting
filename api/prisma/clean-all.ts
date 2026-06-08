import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.$connect();

  const images = await prisma.image.findMany({ select: { publicId: true } });
  console.log(`Found ${images.length} Cloudinary image(s) to delete.`);

  if (images.length > 0) {
    const publicIds = images.map((i) => i.publicId);
    for (let i = 0; i < publicIds.length; i += 100) {
      const batch = publicIds.slice(i, i + 100);
      const result = await cloudinary.api.delete_resources(batch);
      console.log(`Cloudinary batch deleted:`, result.deleted);
    }
  }

  const [tokens, resetTokens, blacklist, users] = await prisma.$transaction([
    prisma.verificationToken.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.tokenBlacklist.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log(`Deleted ${tokens.count} verification token(s).`);
  console.log(`Deleted ${resetTokens.count} password reset token(s).`);
  console.log(`Deleted ${blacklist.count} token blacklist entry(ies).`);
  console.log(`Deleted ${users.count} user(s) (+ their properties and images via cascade).`);
  console.log('Done.');
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
