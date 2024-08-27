import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IFileServiceUpload } from './interfaces/files-service.interface';

@Injectable()
export class FilesService {
  upload({ file }: IFileServiceUpload): string {
    console.log(file);
    // 1. 파일을 클라우드 스토리지에 저장하는 로직
    // 1-1 스토리지 세팅
    const storage = new Storage({
      projectId: 'backend-431315',
      keyFilename: 'gcp-file-storage.json',
    }).bucket('beodeulsori');

    // 1-2 스토리지에 파일 올리기
    file
      .createReadStream()
      .pipe(storage.file(file.filename).createWriteStream())
      .on('finish', () => console.log('성공'))
      .on('error', () => console.log('실패'));

    console.log('파일전송이 완료되었습니다.');

    return '끝!';
  }
}
