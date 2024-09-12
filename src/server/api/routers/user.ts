import { onboardingSchema } from "~/lib/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
});
