import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 8)

  await prisma.user.create({
    data: {
      fullName: 'Administrador do Sistema',
      email: 'admin@escola.com',
      phone: '11912345678',
      role: 'ADMIN',
      password: hashedPassword,
      isActive: true,
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log(`📧 Email: admin@escola.com`)
  console.log(`🔑 Password: ${password}`)
  console.log(`👤 Role: ADMIN`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
