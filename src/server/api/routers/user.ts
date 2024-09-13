import { eq } from "drizzle-orm";
import { z } from "zod";
import { onboardingSchema } from "~/lib/schema";
import { users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  onboarding: protectedProcedure
    .input(onboardingSchema.merge(z.object({ userId: z.string() })))
    .mutation(async ({ input, ctx }) => {
      const yearOfStudy = +input.yearOfStudy;
      const enrollmentNo = +input.enrollmentNo;

      const updatedUser = await ctx.db
        .update(users)
        .set({
          degree: input.degree,
          department: input.department,
          yearOfStudy,
          enrollmentNo,
        })
        .where(eq(users.id, input.userId))
        .returning();
      return updatedUser;
    }),
  profile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const clubPromise = ctx.db.query.clubToMembers.findMany({
      with: {
        club: true,
      },
      where(clubs, { eq }) {
        return eq(clubs.memberId, userId);
      },
    });
    const eventPromise = await ctx.db.query.eventRegistrations.findMany({
      with: {
        event: true,
      },
      where(eventRegistrations, { eq }) {
        return eq(eventRegistrations.memberId, userId);
      },
    });

    const [clubs, events] = await Promise.all([clubPromise, eventPromise]);
    return {
      user: ctx.session.user,
      clubs: clubs.map((club) => ({
        ...club.club,
        postition: club.postition,
      })),
      events: events.map((event) => ({
        ...event.event,
        registeredAt: event.registeredAt,
        status: event.status,
      })),
    };
  }),
});
