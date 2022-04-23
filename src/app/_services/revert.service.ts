import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_FILE_URL = 'http://localhost:8080/api/revert/';

@Injectable({
  providedIn: 'root'
})
export class RevertService {

  constructor(private http: HttpClient) { }

  getFileVersions(fileId: any): Observable<any>{
    return this.http.get(API_FILE_URL + fileId);
  }
  revertFile(fileId: any, versionId: any): Observable<any>{
    return this.http.post(API_FILE_URL + fileId, {versionId});
  }
}
