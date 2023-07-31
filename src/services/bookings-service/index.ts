import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import * as hotelsRepository from "@/repositories/hotels-repository";
import * as bookingRepository from "@/repositories/bookings-repository";
import { TicketStatus } from "@prisma/client";
import { notFoundError, bookingRulesBreaksError } from "../../errors";

export async function getBooking(userId: number) {
    const resultBooking = await bookingRepository.getBookingByUserId(userId);
    if (!resultBooking) throw notFoundError();

    return resultBooking;
}

export async function postBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
    const validateStatus = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (validateStatus.status !== TicketStatus.PAID
        || validateStatus.TicketType.isRemote === true
        || validateStatus.TicketType.includesHotel === false
    ) {
        throw bookingRulesBreaksError();
    }

    const validateRoom = await hotelsRepository.getRoomById(roomId);
    if (!validateRoom) throw notFoundError();
    if (validateRoom.capacity === 0) throw bookingRulesBreaksError()

    return await bookingRepository.postBooking({ userId, roomId });
}

export async function putBooking(bookingId: number, roomId: number, userId: number) {
    const booking = await bookingRepository.getBookingById(bookingId);
    if (!booking) throw notFoundError();
    if (booking.userId !== userId) throw bookingRulesBreaksError();

    const validateRoom = await hotelsRepository.getRoomById(roomId);
    if (!validateRoom) throw notFoundError();
    if (validateRoom.capacity === 0) throw bookingRulesBreaksError();

    return await bookingRepository.putBooking(bookingId, roomId);
}