import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { createTransport } from "nodemailer";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { db } from "./db";
import { userTable, verificationCodesTable } from "./db/schema";

export const sendVerificationCode = async (userId: string) => {
    const code = generateRandomString(8, alphabet("0-9"));

    await db
        .delete(verificationCodesTable)
        .where(eq(verificationCodesTable.userId, userId));

    const id = generateIdFromEntropySize(10);
    await db.insert(verificationCodesTable).values({
        id,
        userId,
        code,
        expiresAt: createDate(new TimeSpan(15, "m")),
    });

    const { email } = (
        await db
            .select({
                email: userTable.email,
            })
            .from(userTable)
            .where(eq(userTable.id, userId))
    )[0];

    const transporter = createTransport({
        host: process.env.MAIL_HOST ?? "",
        port: +(process.env.MAIL_PORT ?? 587),
        secure: false,
        auth: {
            user: process.env.MAIL_USER ?? "",
            pass: process.env.MAIL_PASS ?? "",
        },
    });
    console.log(transporter);
    const s = await transporter.verify().catch((error) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });
    console.log(s);

    const info = transporter.sendMail(
        {
            from: '"Kader" <no-reply@kader.se>',
            to: email,
            subject: "Your verification code has arrived!",
            html: `Your verification code is: <b>${code}</b>`,
        },
        (err, info) => {
            if (err) {
                console.error("error");
                console.error(err);
            }
            console.log(info);
            console.log(`Message sent: ${info.messageId}`);
        }
    );

    return info;
};
