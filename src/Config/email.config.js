import envConfig from "./env.config.js"

const { email } = envConfig;

export const emailConfig = {
    service: "gmail",
    auth: {
        user: email.EMAIL_USERNAME,
        pass: email.EMAIL_PASSWORD
    }
}