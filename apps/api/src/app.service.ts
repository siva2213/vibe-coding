import { Injectable } from "@nestjs/common";
import { HelloResponse } from "@monorepo/shared";

@Injectable()
export class AppService {
  getHello(): HelloResponse {
    return {
      message: "Hello World from Nest.js API!",
    };
  }
}
