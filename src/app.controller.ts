import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    constructor() { }

    @Get('test')
    async test() {
        return `${process.cwd()}`;
    }
}