import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./entities/admin.entity";
import { jwtConstants } from "./constants/constants";
import { JwtModule } from "@nestjs/jwt";
import { Portfolio } from "./entities/portfolio.entity";

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([Admin, Portfolio]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "3600s" },
    }),
  ],
})
export class AdminModule {}
