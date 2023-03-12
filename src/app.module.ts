import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { AppController } from './app.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';

dotenv.config();
@Module({
	imports: [
		MongooseModule.forRoot(process.env.DATABASE_URI),
		ServeStaticModule.forRoot({
			rootPath: path.join(process.cwd(), 'static'),
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: path.join(process.cwd(), "src", "schema.gql"),
			sortSchema: true,
		}),
		UserModule,
		AuthenticationModule,
		AuthorizationModule,
		RoomModule,
		MessageModule,
	],
	controllers: [
		AppController,
	],
	providers: [],
})
export class AppModule { }
