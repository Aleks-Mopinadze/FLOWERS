// Правильный способ: описать форму объекта явно
import { prisma as PrismaUser } from "../../generated/prisma/client";
// prisma — это КЛИЕНТ базы данных, а не тип пользователя!
declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser; // ← здесь висит PrismaClient, а не User
    }
  }
}

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         name: string;
//         email: string;
//         createdAt: Date;
//         updatedAt: Date;
//       };
//     }
//   }
// }
