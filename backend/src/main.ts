import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 유효성 검사 파이프 설정
  app.useGlobalPipes(new ValidationPipe());

  // 전역 예외 필터 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  // 파일 업로드를 위한 GraphQL 미들웨어 설정
  app.use(graphqlUploadExpress());

  // CORS 설정: 포트 5500에서 오는 요청을 허용
  app.enableCors({
    origin: 'http://127.0.0.1:5500', // 허용할 출처
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
    credentials: true, // 쿠키와 인증 헤더를 허용할지 여부
  });

  // 서버를 포트 3000에서 시작
  await app.listen(3000);
}

bootstrap();
