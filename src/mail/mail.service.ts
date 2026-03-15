import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import configuration from '../config/configuration';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const config = configuration();
    
    this.transporter = nodemailer.createTransport({
      service : "gmail",
      // host: config.mail.host,
      // port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Akshay Portfolio" <noreply@akshaysangani.com>',
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Message sent: ${info.messageId}`);
      if (configuration().mail.host.includes('ethereal')) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return true;
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }
}
