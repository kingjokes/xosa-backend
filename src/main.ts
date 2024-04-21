import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.enableCors({
    origin: process.env.ALLOWED_URL?.split(' ')
    ,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  });
  await app.listen(3000 ||process.env.PORT);
}
bootstrap();
