import { createTransport } from "nodemailer";

export const transporter = createTransport({
    host: process.env.MAIL_HOST ?? "",
    port: +(process.env.MAIL_PORT ?? 587),
    secure: process.env.MAIL_PORT == "465" || process.env.MAIL_PORT == "587",
    auth: {
        user: process.env.MAIL_USER ?? "",
        pass: process.env.MAIL_PASS ?? "",
    },
});
