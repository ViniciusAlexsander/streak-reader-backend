-- AddForeignKey
ALTER TABLE "ReadPost" ADD CONSTRAINT "ReadPost_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
