import { prisma } from "@/config";
import { BodyPayment, DataPayment } from "@/protocols";

export async function getPayment(ticketId: number) {
    return await prisma.payment.findFirst({
        where: { ticketId }
    });
}

export async function getUserIdPayment(ticketId: number) {
    const ticket = await prisma.payment.findFirst({
        select: {
            Ticket: {
                select: {
                    TicketType: {
                        select: { price: true, id: true }
                    },
                    Enrollment: {
                        select: { userId: true }
                    }
                }
            }
        },
        where: { ticketId }
    });

    return ticket;
}
export async function postPayment(payment: DataPayment) {
    const result = await prisma.payment.create({
        data: payment
    });
}