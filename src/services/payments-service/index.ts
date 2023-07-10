import * as paymentsRepository from "@/repositories/payments-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { BodyPayment, DataPayment } from "@/protocols";
import { upTicket } from "../../repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

export async function getPayment(ticketId: number, userId: number) {
    const result = await paymentsRepository.getPayment(ticketId);
    if (!result) throw notFoundError();

    const userIdPayment = await getUserIdPayment(ticketId);
    if (userId !== userIdPayment.Ticket.Enrollment.userId) throw unauthorizedError();

    return result;
}

export async function getUserIdPayment(ticketId: number) {
    return await paymentsRepository.getUserIdPayment(ticketId);
}
export async function postPayment(payment: BodyPayment, userId: number) {
    const userIdPayment = await getUserIdPayment(payment.ticketId);

    const status: TicketStatus = "PAID";
    if (!userIdPayment) throw notFoundError();
    if (userId !== userIdPayment.Ticket.Enrollment.userId) throw unauthorizedError();

    const dataPayment: DataPayment =
    {
        ticketId: payment.ticketId,
        value: userIdPayment.Ticket.TicketType.price,
        cardIssuer: payment.cardData.issuer,
        cardLastDigits: `${payment.cardData.number}`,
    };

    await paymentsRepository.postPayment(dataPayment);
    await upTicket(payment.ticketId, userIdPayment.Ticket.TicketType.id, status);
    return await getPayment(payment.ticketId, userId);
}