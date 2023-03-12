import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: [
			process.env.CLIENT_SERVER,
			process.env.CLIENT_LOCALHOST,
			process.env.SOCKET_SERVER,
		],
		preflightContinue: false,
		optionsSuccessStatus: 204,
	});
	await app.listen(process.env.PORT);
}
bootstrap();
