# 1. 운영체제 및 프로그램 설치
#FROM ubuntu:22.04

#RUN sudo apt install nodejs
#RUN sudo npm install -g yarn

# 1. 운영체제 및 프로그램 설치(리눅스, node, npm, yarn 모두 설치된 컴퓨터)

FROM node:18-alpine

# 2. 내 컴퓨터에 있는 폴더나 파일을 도커 컴퓨터 안으로 복사하기
# RUN mkdir myfolder => 만들지 않아도 없으면 알아서만듦
COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
# RUN cd ./myfolder/
WORKDIR /myfolder/

RUN yarn install

COPY . /myfolder/

# 3. 도커 안에서 index.js 실행시키기
# RUN node index.js
CMD yarn start:dev
