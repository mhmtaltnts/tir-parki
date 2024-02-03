import type { User, Dorse } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Dorse };

export async function getDorseWithUser({
  id,
  userId,
}: Pick<Dorse, "id"> & {
  userId: User["id"];
}) {
  return prisma.dorse.findFirst({
    select: { id: true, plaka: true, firma: true, user: true },
    where: { id, userId },
  });
}

export function getDorseList() {
  return prisma.dorse.findMany();
}

export async function getDorse({ id }: Pick<Dorse, "id">) {
  return prisma.dorse.findFirst({
    select: { id: true, plaka: true, firma: true, userId: true },
    where: { id },
  });
}

export async function getAllDorse() {
  return prisma.dorse.findMany();
}

export function getDorseInPark() {
  return prisma.dorse.findMany({
    where: {
      girisler: {
        some: {
          cikis: undefined,
        },
      },
    },
  });
}

export async function getDorseListOfUser({ userId }: { userId: User["id"] }) {
  return prisma.dorse.findMany({
    where: { userId },
    select: { id: true, plaka: true, firma: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createDorse({
  plaka,
  firma,
  userId,
}: Pick<Dorse, "plaka" | "firma"> & {
  userId: User["id"];
}) {
  return prisma.dorse.create({
    data: {
      plaka,
      firma,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function updateDorse({
  id,
  plaka,
  firma,
  userId,
}: Pick<Dorse, "id" | "plaka" | "firma"> & {
  userId: User["id"];
}) {
  return prisma.dorse.update({
    where: { id },
    data: {
      plaka,
      firma,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function deleteDorse({ id }: Pick<Dorse, "id">) {
  return prisma.dorse.deleteMany({
    where: { id },
  });
}
