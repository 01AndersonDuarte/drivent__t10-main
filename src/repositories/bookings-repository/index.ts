import { prisma } from "@/config";
import { InputBooking } from "../../protocols";

export async function getBookingByUserId(userId: number) {
    return await prisma.booking.findFirst({
        where: {
            userId
        },
        select: {
            id: true,
            Room: true
        }
    });

}

export async function getBookingById(id: number) {
    return await prisma.booking.findFirst({
        where: {
            id
        }
    });

}

export async function postBooking(booking: InputBooking) {
    return await prisma.booking.create({
        data: booking
    });
}

export async function putBooking(bookingId: number, roomId: number) {
    return await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId
        },
        select: {
            id: true
        }
    });

}