import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { IntegrationModule } from './integration/integration.module';
import { AuthModule } from './auth/auth.module';
import { MerchantModule } from './merchant/merchant.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // transport: `smtps://${configService.get<string>('EMAIL_USER')}:${configService.get<string>('EMAIL_PASSWORD')}@${configService.get<string>('EMAIL_HOST')}`,
        transport: {
          name: 'dispatchja.com',
          host: configService.get<string>('EMAIL_HOST'),
          secure: configService.get<boolean>('EMAIL_IS_SECURE'),
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL_SENDER'),
        },
        template: {
          dir: __dirname + '/email/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    EmailModule,
    AuthModule,
    UsersModule,
    IntegrationModule,
    MerchantModule,
  ],
})
export class AppModule {}
