export class FileDTO {
    public id: string;
    public name: string;
    public encodedData: string;
    constructor(id: string, name: string, encodedData: string) {
        this.id = id;
        this.name = name;
        this.encodedData = encodedData;
    } 
} 