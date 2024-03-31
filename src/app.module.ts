import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminModule } from "./admin/admin.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./admin/entities/admin.entity";
import { Portfolio } from "./admin/entities/portfolio.entity";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

@Module({
  imports: [
    AdminModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "xosa",
      entities: [Admin, Portfolio],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads/",
    }),
    MailerModule.forRoot({
      // transport: "smtps://notify@glambyxosah.com:KlsT]P9hA-[-/?pool=true",
      transport: {
        host: "glambyxosah.com",
        port: 465,
        secure: true,
        auth: {
          user: "notify@glambyxosah.com",
          pass: "KlsT]P9hA-[-",
        },
      },
      defaults: {
        from: '"Notify" <notify@glambyxosah.com>',
      },
      template: {
        dir: __dirname + "/templates",
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
