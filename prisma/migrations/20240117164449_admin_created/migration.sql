/*
  Warnings:

  - The `is_Admin` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "is_Admin",
ADD COLUMN     "is_Admin" BOOLEAN NOT NULL DEFAULT false;
