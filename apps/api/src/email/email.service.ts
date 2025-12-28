import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = this.configService.get('SMTP_PORT');
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPass = this.configService.get('SMTP_PASS');

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort || 587,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      this.logger.warn(
        'SMTP not configured. Email functionality will be disabled.',
      );
    }
  }

  async sendInviteEmail(
    email: string,
    name: string,
    inviteToken: string,
  ): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn(
        `Would send invite email to ${email} with token ${inviteToken}`,
      );
      return false;
    }

    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
    const inviteUrl = `${frontendUrl}/invite/${inviteToken}`;
    const fromEmail =
      this.configService.get('SMTP_FROM') || 'noreply@example.com';

    try {
      await this.transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: 'You have been invited to join the Admin Dashboard',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome, ${name}!</h1>
              </div>
              <div style="padding: 40px 30px;">
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                  You have been invited to join the Admin Dashboard. Click the button below to set your password and activate your account.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                    Accept Invitation
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                  This invitation link will expire in 24 hours.
                </p>
                <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 20px 0 0;">
                  If you didn't request this invitation, you can safely ignore this email.
                </p>
              </div>
              <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  If the button doesn't work, copy and paste this link into your browser:
                  <br>
                  <a href="${inviteUrl}" style="color: #667eea; word-break: break-all;">${inviteUrl}</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(`Invite email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send invite email to ${email}`, error);
      return false;
    }
  }
}

