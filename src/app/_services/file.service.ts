import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileView, FileViewList } from '../_interface/file-view';
import { FileDTO } from '../_models/file';
import { TokenStorageService } from './token-storage.service';
import { SortDirection } from "@angular/material/sort";

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

  constructor(private http: HttpClient) { }

  getFilesSimple(userId: number): Observable<FileView> {
    return this.http.post<FileView>(`${FILE_API}`, { userId });
  }

  getFiles(userId: number, sort: string, order: SortDirection, page: number, size: number,
    id: number,name: string, originalName: string, description: string,
    fileType: string, contentType: string, extension: string, version: number,
    uploadDate: Date, updateDate: Date, uploaderName: string): Observable<FileViewList> {
     
    return this.http.post<FileViewList>(`${FILE_API}`, {
      userId, id, name, originalName, description,
      fileType, contentType, extension, version, uploadDate, updateDate, uploaderName, sort, order, page, size
    });
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

  shareFile(fileId: any, userToShareId: any): Observable<any> {
    return this.http.post(FILE_API + '/' + fileId + '/share', { userToShareId });
  }

  setFile(fileToUpdate?: any) {
    this.fileToUpdate.next(fileToUpdate);
  }
}
