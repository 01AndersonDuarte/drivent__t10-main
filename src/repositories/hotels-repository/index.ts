import { prisma } from "@/config";

export async function getHotels() {
    return await prisma.hotel.findMany();
}

export async function getHotelRooms() {

}