import { SMTPClient } from "emailjs";

console.log("MAIL_HOST", process.env.MAIL_HOST);
console.log("MAIL_PORT", process.env.MAIL_PORT);
console.log("MAIL_USER", process.env.MAIL_USER);
console.log("MAIL_PASS", process.env.MAIL_PASS);

export const mail = new SMTPClient({
    host: process.env.MAIL_HOST,
    port: +(process.env.MAIL_PORT || 587),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
    ssl: true,
    authentication: ["PLAIN"],
});
