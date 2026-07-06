import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ SEED SCRIPT ABORTED: Cannot run seed script in production environment.');
    process.exit(1);
  }

  console.log('🌱 Seeding started...');

  // Upsert Categories
  const categoryNames = ['Laptops', 'Smartphones', 'Monitores', 'Accesorios', 'Componentes'];
  const categories = [];

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `Categoría de ${name}`,
        isActive: true,
      },
    });
    categories.push(category);
  }
  console.log(`✅ ${categories.length} Categories upserted.`);

  // Find Users
  const client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
  if (!client) {
    console.warn('⚠️ No CLIENT user found. Skipping order and cart generation.');
  } else {
    console.log('✅ Existing CLIENT user found.');
  }

  // Generate Products if missing
  // We identify seeded products by a specific brand or description pattern
  const SEED_BRAND = 'TechSpec Mock';
  const existingProducts = await prisma.product.count({ where: { brand: SEED_BRAND } });

  let products = [];
  if (existingProducts < 30) {
    console.log('Generating new mock products...');
    faker.seed(123); // Deterministic data
    for (let i = existingProducts; i < 30; i++) {
      const category = categories[Math.floor(faker.number.float({ min: 0, max: categories.length - 1 }))];
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          brand: SEED_BRAND,
          categoryId: category.id,
          price: faker.number.float({ min: 10, max: 2000, fractionDigits: 2 }),
          stock: faker.number.int({ min: 0, max: 100 }),
          imageUrl: faker.image.urlLoremFlickr({ category: 'technology' }),
          imagePublicId: 'mock_image_id_' + i,
          images: [],
          specifications: { "Feature": "Value" },
          isActive: true,
        }
      });
      products.push(product);
    }
    console.log('✅ 30 Products seeded.');
  } else {
    console.log('✅ Products already seeded (ignored duplicate creation).');
    products = await prisma.product.findMany({ where: { brand: SEED_BRAND }, take: 30 });
  }

  // Generate Order for Client
  if (client && products.length > 0) {
    const existingOrders = await prisma.order.count({ where: { userId: client.id } });
    if (existingOrders === 0) {
      const orderProduct1 = products[0];
      const orderProduct2 = products[1];

      await prisma.order.create({
        data: {
          userId: client.id,
          totalAmount: Number(orderProduct1.price) + Number(orderProduct2.price) * 2,
          status: 'DELIVERED',
          orderItems: {
            create: [
              {
                productId: orderProduct1.id,
                quantity: 1,
                unitPrice: orderProduct1.price
              },
              {
                productId: orderProduct2.id,
                quantity: 2,
                unitPrice: orderProduct2.price
              }
            ]
          }
        }
      });
      console.log('✅ Sample order created for client.');
    } else {
      console.log('✅ Orders already exist for client (ignored).');
    }

    // Generate Cart for Client
    const existingCartItems = await prisma.cartItem.count({ where: { userId: client.id } });
    if (existingCartItems === 0) {
      const cartProduct1 = products[2];
      const cartProduct2 = products[3];
      
      await prisma.cartItem.createMany({
        data: [
          { userId: client.id, productId: cartProduct1.id, quantity: 1 },
          { userId: client.id, productId: cartProduct2.id, quantity: 3 }
        ]
      });
      console.log('✅ Sample cart items created for client.');
    } else {
      console.log('✅ Cart items already exist for client (ignored).');
    }
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
