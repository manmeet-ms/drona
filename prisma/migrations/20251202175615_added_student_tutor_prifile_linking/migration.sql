-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "aspirations" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "school" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationDocument" TEXT;
