import { prisma } from "@/config";
import { BodyPayment, DataPayment } from "@/protocols";

export async function getPayment(ticketId: number) {
    return await prisma.payment.findFirst({
        where: { ticketId }
    });
}

export async function getUserIdPayment(ticketId: number) {
    const ticket = await prisma.ticket.findFirst({
        select: {
            TicketType: {
                select: { price: true, id: true }
            },
            Enrollment: {
                select: { userId: true }
            }
        },
        where: { id: ticketId }
    });

    return ticket;
}
export async function postPayment(payment: DataPayment) {
    const result = await prisma.payment.create({
        data: payment
    });
}