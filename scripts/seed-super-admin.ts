import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

  const email = "titanartdesignstudio@gmail.com"
  const password = "Admin@123"

  //////////////////////////////////////////////////////
  // CHECK EXISTING
  //////////////////////////////////////////////////////

  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    console.log("⚠️ Super Admin already exists")
    return
  }

  //////////////////////////////////////////////////////
  // HASH PASSWORD
  //////////////////////////////////////////////////////

  const hashedPassword = await bcrypt.hash(password, 10)

  //////////////////////////////////////////////////////
  // CREATE USER
  //////////////////////////////////////////////////////

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
      isVerified: false, // OTP ke baad true hoga
    },
  })

  console.log("✅ Super Admin Created Successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })