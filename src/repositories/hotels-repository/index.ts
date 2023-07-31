import { prisma } from "@/config";

export async function getHotels() {
    return await prisma.hotel.findMany();
}

export async function getHotelById() {

}

export async function getRoomById(roomId: number) {
    return await prisma.room.findFirst({
        where: {
            id: roomId
        }
    });
}

export async function getHotelRooms(hotelId: number) {
    return await prisma.hotel.findFirst({
        where: {
            id: hotelId
        },
        include: {
            Rooms: true
        }
    });
}