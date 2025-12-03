import prisma from '@/src/lib/prisma';

async function main() {
  console.log('Client loaded');
  try {
    console.log('Prisma instance created');
    await prisma.$connect();
    console.log('Connected to DB');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Error:', e);
  }
}

main();
