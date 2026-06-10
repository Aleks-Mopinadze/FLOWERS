import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Start seeding flower store data...");

  // 1. Clean up existing data to prevent duplicate unique name constraints during re-runs
  // (Optional, but highly recommended for seed files)
  await prisma.product.deleteMany({});
  await prisma.productCategory.deleteMany({});

  // 2. Create Product Categories
  const bouquetsCategory = await prisma.productCategory.create({
    data: { name: "Bouquets" },
  });
  const indoorPlantsCategory = await prisma.productCategory.create({
    data: { name: "Indoor Plants" },
  });

  const driedFlowersCategory = await prisma.productCategory.create({
    data: { name: "Dried Flowers" },
  });

  console.log("✅ Created product categories. seeding finished");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
