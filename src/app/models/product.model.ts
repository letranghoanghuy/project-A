export default class Product {
    key?: string | null;
    name?: string;
    price?: number;
    publish?: boolean;
    imageKey?: string;
    imageName?: string;
    imageURL?: string;
    description?: string;
    // metaTitle?: string;
    // metaKeyword?: string;
    // metaDescription?: string;
}

export class FileUpload {
    key!: string;
    name!: string;
    url!: string;
    file: File;

    constructor(file: File) {
        this.file = file;
    }
}


