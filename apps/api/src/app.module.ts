import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { PackagesModule } from './packages/packages.module';
import { ProjectsModule } from './projects/projects.module';
import { SettingsModule } from './settings/settings.module';
import { MessagesModule } from './messages/messages.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'website_db'),
        entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ServicesModule,
    PackagesModule,
    ProjectsModule,
    SettingsModule,
    MessagesModule,
    ProfileModule,
    UsersModule,
    EmailModule,
    UploadModule,
    HealthModule,
  ],
})
export class AppModule {}

