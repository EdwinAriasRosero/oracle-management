import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allows all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allows common HTTP methods
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Allows cookies and authorization headers to be sent
  });

  // Attach the WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
