import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://glambyxosah.com",
      "https://glambyxosa.com",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
