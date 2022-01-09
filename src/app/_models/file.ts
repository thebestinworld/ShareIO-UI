import { Type } from "@angular/core";

export interface FileDTO {
    id: string;
    name: string;
    encodedData: string;
    fileType: string;
    extension: string;
    originalName: string;
    description: string
    version: number;
    uploadDate: string;
    updateDate: string;
    uploaderName: string;
    uploaderId: number;
} 