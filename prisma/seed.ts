import "dotenv/config";
import prisma from '../src/lib/prisma.ts';

async function main() {
  for (let index = 0; index <100; index++) {
    await prisma.ping.create({ data: { message: 'pong' } });
    
  } 
}
main().finally(async () => prisma.$disconnect());