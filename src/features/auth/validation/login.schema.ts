import { z } from "zod";

export const loginSchema = z.string().refine((value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(value);
}, {
    message: "Invalid indian mobile number",
});

