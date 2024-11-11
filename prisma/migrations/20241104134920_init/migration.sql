-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "imageFieldId" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "image_imageFieldId_key" ON "image"("imageFieldId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_imageId_key" ON "user"("imageId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
