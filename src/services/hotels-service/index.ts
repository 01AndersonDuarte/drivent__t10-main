import * as hotelRepository from "@/repositories/hotels-repository";
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from "@/repositories/tickets-repository";
import paymentsRepository from "@/repositories/payments-repository";
import { notFoundError } from "@/errors";
import { TicketStatus } from "@prisma/client";
import { paymentRequiredError } from "../../errors/payment-required";

export async function validate(userId: number){
    const enrollment = await enrollmentRepository.findById(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketsRepository.findTickeWithTypeById(ticket.id);

    console.log(ticketType)
    if (ticketType.TicketType.isRemote===true || ticketType.TicketType.includesHotel===false) throw paymentRequiredError();

    // const payment = await paymentsRepository.findPaymentByTicketId(ticket.id);
    // if (!payment) throw notFoundError();
}
export async function getHotels(userId: number) {
    await validate(userId);   
    return await hotelRepository.getHotels();
}
export async function getHotelRooms() {

}