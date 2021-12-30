import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) { }

	public sendEmail(option: ISendMailOptions) {
		return this.mailerService
			.sendMail(option)
	}

}
