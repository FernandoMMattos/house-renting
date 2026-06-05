import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(config.getOrThrow<string>('RESEND_API_KEY'));
    this.from = config.getOrThrow<string>('EMAIL_FROM');
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    const link = `${frontendUrl}/verify-email?token=${token}`;

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Verify your email — House Renting',
      html: `
        <h2>Welcome to House Renting</h2>
        <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">Verify Email</a>
        <p>Or copy this link: <a href="${link}">${link}</a></p>
      `,
    });

    if (error) {
      this.logger.error('Failed to send verification email', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    const link = `${frontendUrl}/reset-password?token=${token}`;

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Reset your password — House Renting',
      html: `
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">Reset Password</a>
        <p>Or copy this link: <a href="${link}">${link}</a></p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `,
    });

    if (error) {
      this.logger.error('Failed to send password reset email', error);
      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }
}
