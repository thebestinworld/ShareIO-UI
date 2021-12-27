import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


const FILE_API = 'http://localhost:8080/api/file/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private fileId = new BehaviorSubject<any>([]);
  currentDetail = this.fileId.asObservable();

  constructor(private http: HttpClient) { }

  upload(data: any): Observable<any> {
    return this.http.post(FILE_API + 'upload', data, httpOptions);
  }

  uploadFileData(file: File, fileId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${FILE_API}${fileId}/upload/data`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  setFileId(fileId?: any) {
    this.fileId.next(fileId);
  }
}
