import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

dotenv.config();
export class Mail {
    public async sendEmail(toEmail: string, subject: string, text: string): Promise<boolean> {
        const mailOptions = {
            from: `${process.env.HOST_MAIL}`,
            to: `${toEmail}`,
            subject: `${subject}`,
            text: `${text}`,
        }
        const send = await this.transporter().sendMail(mailOptions);
        if (send.accepted) {
            return true;
        }
        return false;
    }
    private transporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAUTH2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.MAIL_OAUTH_CLIENT_ID,
                clientSecret: process.env.MAIL_OAUTH_CLIENT_SECRET,
                refreshToken: process.env.MAIL_OAUTH_REFRESH_TOKEN,
            }
        });
        return transporter;
    }
}

