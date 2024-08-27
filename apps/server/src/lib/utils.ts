import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { db } from "./db";
import { userTable, verificationCodesTable } from "./db/schema";
import { transporter } from "./mail";

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

    const info = await transporter.sendMail({
        from: '"Kader" <no-reply@kader.se>',
        to: email,
        subject: "Your verification code has arrived!",
        html: `Your verification code is: <b>${code}</b>`,
    });

    return info;
};
