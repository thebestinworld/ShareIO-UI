import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileDTO } from '../_models/file';
import { TokenStorageService } from './token-storage.service';

const FILE_API = 'http://localhost:8080/api/file';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private fileToUpdate = new BehaviorSubject<any>([]);
  currentDetail = this.fileToUpdate.asObservable();
  
  constructor(private http: HttpClient,) { }

  getFiles(userId: number): Observable<any> {
    return this.http.post(`${FILE_API}`, { userId });
  }

  getFile(fileId: any): Observable<any> {
    return this.http.get<FileDTO>(FILE_API + '/' + fileId);
  }

  updateFile(data: any, fileId: any): Observable<any> {
    return this.http.patch(FILE_API + '/' + fileId, data);
  }

  updateFileData(file: File, fileId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${FILE_API}/${fileId}/data`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  deleteFile(fileId: any): Observable<any> {
    return this.http.delete(FILE_API + '/' + fileId);
  }

  setFile(fileToUpdate?: any) {
    this.fileToUpdate.next(fileToUpdate);
  }
}
