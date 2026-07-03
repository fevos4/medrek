-- AlterTable
ALTER TABLE "posts" ADD COLUMN "videoUrl" TEXT;
ALTER TABLE "posts" ALTER COLUMN "type" SET DEFAULT 'text';
