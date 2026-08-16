-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "ScholarshipStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ScholarshipType" AS ENUM ('NEEDY', 'ACADEMIC', 'WORK', 'EMERGENCY', 'ACTIVITY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipRequest" (
    "id" SERIAL NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "gpax" DECIMAL(3,2) NOT NULL,
    "email" TEXT NOT NULL,
    "scholarshipType" "ScholarshipType" NOT NULL,
    "requestedAmount" DECIMAL(12,2) NOT NULL,
    "bankAccount" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "pdpaConsent" BOOLEAN NOT NULL DEFAULT false,
    "pdpaConsentAt" TIMESTAMP(3),
    "status" "ScholarshipStatus" NOT NULL DEFAULT 'PENDING',
    "staffNote" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScholarshipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER,
    "scholarshipRequestId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipRequest_requestNumber_key" ON "ScholarshipRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "ScholarshipRequest_studentId_idx" ON "ScholarshipRequest"("studentId");

-- CreateIndex
CREATE INDEX "ScholarshipRequest_studentName_idx" ON "ScholarshipRequest"("studentName");

-- CreateIndex
CREATE INDEX "ScholarshipRequest_status_idx" ON "ScholarshipRequest"("status");

-- CreateIndex
CREATE INDEX "ScholarshipRequest_scholarshipType_idx" ON "ScholarshipRequest"("scholarshipType");

-- CreateIndex
CREATE INDEX "ScholarshipRequest_deletedAt_idx" ON "ScholarshipRequest"("deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_scholarshipRequestId_idx" ON "AuditLog"("scholarshipRequestId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_scholarshipRequestId_fkey" FOREIGN KEY ("scholarshipRequestId") REFERENCES "ScholarshipRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
