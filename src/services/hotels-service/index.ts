import * as hotelRepository from "@/repositories/hotels-repository";
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from "@/repositories/tickets-repository";
import paymentsRepository from "@/repositories/payments-repository";
import { notFoundError } from "@/errors";
import { TicketStatus } from "@prisma/client";
import { paymentRequiredError } from "@/errors/payment-required";

export async function validate(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketsRepository.findTickeWithTypeById(ticket.id);
    if (ticketType.status === TicketStatus.RESERVED || ticketType.TicketType.isRemote === true || ticketType.TicketType.includesHotel === false) throw paymentRequiredError();
}
export async function getHotels(userId: number) {
    await validate(userId);
    return await hotelRepository.getHotels();
}
export async function getHotelRooms(hotelId: number, userId: number) {
    await validate(userId);
    const result = await hotelRepository.getHotelRooms(hotelId);
    if (!result) throw notFoundError();

    return result;
}