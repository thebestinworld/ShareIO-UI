import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { File } from '../_models/file';
import { TokenStorageService } from './token-storage.service';

const FILE_API = 'http://localhost:8080/api/file';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient,) { }

  getFiles(userId: number): Observable<any> {
    return this.http.post(`${FILE_API}`, { userId });
  }

  getFile(fileId: any): Observable<any> {
    return this.http.get<File>(FILE_API + '/' + fileId);
  }
}
