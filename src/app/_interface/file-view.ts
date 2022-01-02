export interface FileView {
    id: string;
    originalName: string;
    name: string;
    description: string;
    fileType: string;
    contentType: string;
    extension: string;
    version: number;
    uploadDate: string;
    updateDate: string;
    uploader: string;
    encodedData: string;
    uploaderName: string;
  }

  export interface FileViewList {
    items: FileView[];
    totalCount: number;
  }