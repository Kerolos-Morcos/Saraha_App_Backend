import envConfig from "../../Config/env.config.js";
import { emailTransporter } from "../Clients/email.client.js";
import { BadRequestException } from "../Utils/Errors/exception.error.js";
import { emailVerificationTemplate } from "../Templates/emailVerification.template.js";
import { EventEmitter } from "events";

const { email } = envConfig;
export const sendEmailService = async ({ to, subject = "", message, attachments = [] }) => {
    if (!message && !attachments.length) throw new BadRequestException("No message or attachments provided");
    try {
        const info = await emailTransporter.sendMail({
            from: `no-reply <${email.EMAIL_USERNAME}>`,
            to,
            subject,
            html: message,
            attachments
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new BadRequestException("Error sending email");
    }
}

// Send Email Event
export const eventEmitter = new EventEmitter();
eventEmitter.on("sendMailEvent", async ({ to, subject = "", firstName, otp }) => {
    try {
        await sendEmailService({
            to,
            subject: subject || "Verify Your Email Address",
            message: emailVerificationTemplate({ firstName, otp })
        });
    } catch (error) {
        console.error("Email event failed:", error);
    }
});