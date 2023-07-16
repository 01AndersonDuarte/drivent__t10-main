import faker from '@faker-js/faker';
import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

export function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl()
    },
  });
}

export function createRoom(hotelId: number): Promise<Room>{
    return prisma.room.create({
        data: {
            name: faker.company.catchPhrase(),
            capacity: faker.datatype.number({min: 1, max: 100}),
            hotelId: hotelId,
        }
    });
}
