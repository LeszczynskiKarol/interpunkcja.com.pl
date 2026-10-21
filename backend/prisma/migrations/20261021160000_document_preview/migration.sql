-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "preview" JSONB,
ADD COLUMN     "previewAt" TIMESTAMP(3),
ADD COLUMN     "previewIp" TEXT;

-- CreateIndex
CREATE INDEX "Document_previewIp_idx" ON "Document"("previewIp");

