import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ContactDto } from './contact.dto';
import configuration from '../config/configuration';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly mailService: MailService) { }

  async handleContactRequest(contactDto: ContactDto) {
    this.logger.log(`Received contact request from ${contactDto.email}`);

    const htmlContent = `
      <h3>New Portfolio Contact</h3>
      <p><strong>Name:</strong> ${contactDto.name}</p>
      <p><strong>Email:</strong> ${contactDto.email}</p>
      <p><strong>Message:</strong></p>
      <p>${contactDto.message.replace(/\n/g, '<br>')}</p>
    `;

    const textContent = `
      New Portfolio Contact
      Name: ${contactDto.name}
      Email: ${contactDto.email}
      Message:
      ${contactDto.message}
    `;

    // Assuming we want to send the notification to the portfolio owner
    const ownerEmail = configuration().mail.user || 'sanganiakshay101@gmail.com';

    await this.mailService.sendMail(
      ownerEmail,
      `Portfolio Contact Request from ${contactDto.name}`,
      textContent,
      htmlContent
    );

    return { success: true, message: 'Message sent successfully' };
  }
}
