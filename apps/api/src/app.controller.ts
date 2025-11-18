import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { HelloResponse } from "@monorepo/shared";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("hello")
  getHello(): HelloResponse {
    return this.appService.getHello();
  }
}

