import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

export async function getAllTickets() {
    return await prisma.ticketType.findMany();
}

export async function getTicket(userId: number) {
    const result = await prisma.ticket.findFirst({
        where: { enrollmentId: userId },
        select: {
            TicketType: {
                select: {
                }
            }
        },
        
    });
}

export async function postTicket(userId: number, ticketTypeId: number) {
    const result = await prisma.ticket.upsert({
        create: { enrollmentId: userId, ticketTypeId, status: "RESERVED" },
        update: { ticketTypeId, status: "RESERVED" },
        where: { enrollmentId: userId } as Ticket
    });

    return result;
}