import { z } from "zod";

export const MessageValidationSchema = z.object({
    content: z
        .string()
        .min(10, "Message cannot be less than 10 characters")
        .max(200, "Message cannot be more than 200 characters")
});
