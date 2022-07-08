import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileService } from '../_services/file.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { FileView, FileViewList } from '../_interface/file-view';
import { MatSort } from '@angular/material/sort';
import { of, merge } from 'rxjs';
import { startWith, switchMap, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { EventBusService } from '../_shared/event-bus.service';
import { Router } from '@angular/router';
import { EventData } from '../_shared/event.class';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit, AfterViewInit {

  currentUser: any;
  displayedColumns: string[] = ['id', 'name', 'originalName', 'description', 'fileType',
    'extension', 'contentType', 'version', 'uploadDate', 'updateDate', 'uploader'];
  data: FileView[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;;

  idFilter = new FormControl('');
  nameFilter = new FormControl('');
  originalFileNameFilter = new FormControl('');
  descriptionFilter = new FormControl('');
  fileTypeFilter = new FormControl('');
  contentTypeFilter = new FormControl('');
  extensionFilter = new FormControl('');
  versionFilter = new FormControl('');
  uploadDateFilter = new FormControl(new Date());
  updateDateFilter = new FormControl(new Date());
  uploaderNameFilter = new FormControl('');

  filterValues: any = {
    id: '',
    name: '',
    originalFileName: '',
    description: '',
    fileType: '',
    contentType: '',
    extension: '',
    version: '',
    uploadDate: '',
    updateDate: '',
    uploaderName: ''

  }

  constructor(private fileService: FileService, private token: TokenStorageService, 
    private eventBusService: EventBusService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.idFilter.valueChanges
      .subscribe(
        id => {
          this.filterValues.id = id;
        }
      )
    this.nameFilter.valueChanges
      .subscribe(
        name => {
          this.filterValues.name = name;
        }
      )
    this.originalFileNameFilter.valueChanges
      .subscribe(
        originalFileName => {
          this.filterValues.originalFileName = originalFileName;
        }
      )
    this.descriptionFilter.valueChanges
      .subscribe(
        description => {
          this.filterValues.description = description;
        }
      )
    this.fileTypeFilter.valueChanges
      .subscribe(
        fileType => {
          this.filterValues.fileType = fileType;
        }
      )
    this.contentTypeFilter.valueChanges
      .subscribe(
        contentType => {
          this.filterValues.contentType = contentType;
        }
      )
    this.extensionFilter.valueChanges
      .subscribe(
        extension => {
          this.filterValues.extension = extension;
        }
      )
    this.versionFilter.valueChanges
      .subscribe(
        version => {
          this.filterValues.version = version;
        }
      )
    this.uploadDateFilter.valueChanges
      .subscribe(
        uploadDate => {
          const datepipe: DatePipe = new DatePipe('en-US')
          let formattedDate = datepipe.transform(uploadDate, 'YYYY-MM-dd')
          this.filterValues.uploadDate = formattedDate;
        }
      )
    this.updateDateFilter.valueChanges
      .subscribe(
        updateDate => {
          const datepipe: DatePipe = new DatePipe('en-US')
          let formattedDate = datepipe.transform(updateDate, 'YYYY-MM-dd')
          this.filterValues.updateDate = formattedDate;

        }
      )
    this.uploaderNameFilter.valueChanges
      .subscribe(
        uploaderName => {
          this.filterValues.uploaderName = uploaderName;
        }
      )
    this.uploaderNameFilter.valueChanges
      .subscribe(
        uploaderName => {
          this.filterValues.uploaderName = uploaderName;
        }
      )
    merge(this.sort.sortChange,
      this.idFilter.valueChanges,
      this.nameFilter.valueChanges,
      this.originalFileNameFilter.valueChanges,
      this.descriptionFilter.valueChanges,
      this.fileTypeFilter.valueChanges,
      this.contentTypeFilter.valueChanges,
      this.extensionFilter.valueChanges,
      this.versionFilter.valueChanges,
      this.uploadDateFilter.valueChanges,
      this.updateDateFilter.valueChanges,
      this.uploaderNameFilter.valueChanges,
      this.paginator.page
    ).pipe(
      startWith({}),
      switchMap(() => {
        return this.fileService!.getFiles(this.currentUser.id, this.sort.active,
          this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize,
          this.filterValues.id,
          this.filterValues.name,
          this.filterValues.originalFileName,
          this.filterValues.description,
          this.filterValues.fileType,
          this.filterValues.contentType,
          this.filterValues.extension,
          this.filterValues.version,
          this.filterValues.uploadDate,
          this.filterValues.updateDate,
          this.filterValues.uploaderName)
          .pipe(catchError((err, caught) => {
            if (err.message === 'Refresh Token Expired') {
              this.eventBusService.emit(new EventData('logout', null));
              this.router.navigate(['/'])
            }
            return caught;
          }));
      }),
      map(data => {
        if (data === null) {
          return [];
        }
        this.resultsLength = data.totalCount;
        return data.items;
      })
    ).subscribe(data => this.data = data);
  }

  clearFilter() {
    this.nameFilter.setValue('');
    this.originalFileNameFilter.setValue('');
    this.descriptionFilter.setValue('');
    this.fileTypeFilter.setValue('');
    this.contentTypeFilter.setValue('');
    this.extensionFilter.setValue('');
    this.versionFilter.setValue('');
    this.uploadDateFilter.setValue('');
    this.updateDateFilter.setValue('');
    this.uploaderNameFilter.setValue('');
  }
}

