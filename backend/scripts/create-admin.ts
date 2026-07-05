import prisma from '../src/utils/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'admin@techspec.com';
  const password = 'adminpassword';

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log(`User with email ${email} already exists. Updating role to ADMIN.`);
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log('Role updated to ADMIN successfully.');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: 'TechSpec Admin',
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`Admin user created successfully! Email: ${email}, Password: ${password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
