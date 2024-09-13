import { z } from "zod";

export const onboardingSchema = z.object({
  degree: z.string({ required_error: "Please select your degree" }),
  department: z.string({ required_error: "Please select your department" }),
  enrollmentNo: z.string({
    required_error: "Please enter your enrollment number",
  }),
  yearOfStudy: z.string({ required_error: "Please select your year of study" }),
});

export const createClubSchema = z.object({
  name: z
    .string()
    .min(1, "Club name is required")
    .max(255, "Club name must be 255 characters or less"),
  description: z.string().min(1, "Description is required"),
  image: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), "Please Select Image")
        .refine(
          (file) => file.size <= 1024 * 1024,
          "Image size must be less than 1MB",
        ),
    )
    .nonempty({ message: "Please select an image" }),
});
