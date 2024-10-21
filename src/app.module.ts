import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.HOST,
      port: +process.env.PORT,
      username: 'sa',
      password: process.env.MSSQL_PASSWORD,
      synchronize: true,
      autoLoadEntities: true,
      options: {
        trustServerCertificate: true,
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
