import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: "Gmail", // You can use any SMTP provider (Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your app password or SMTP password
    },
});

/**
 * Sends an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const mailOptions = {
            from: `"Flight Booking System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📩 Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email Sending Error:", error);
    }
};
