import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import Product, { FileUpload } from '../models/product.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private dbPath = '/products';
  productsRef: AngularFireList<Product>;
  productRef: AngularFireObject<Product>;

  private basePath = '/images';

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) {
    this.productsRef = db.list(this.dbPath);

  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password).then((credential) => {
      // console.log(credential);
    }).catch((err) => {
      if (err.code) {
        return err;
      }
    })
  }

  getAllProducts(): AngularFireList<Product> {
    return this.productsRef;
  }

  getProduct(key: string) {
    this.productRef = this.db.object(this.dbPath + '/' + key);
    return this.productRef;
  }

  createProduct(product: Product, key: string): any {
    return this.db.database.ref(this.dbPath).child(key).set(product);
  }

  updateProduct(key: string, value: any): Promise<void> {
    return this.productsRef.update(key, value)
  }

  deleteProduct(key: string): Promise<void> {
    return this.productsRef.remove(key);
  }

  pushFileToStorage(fileUpload: FileUpload, key: string): Observable<number | undefined> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(fileUpload, key);
          this.updateProduct(key, { imageURL: downloadURL, imageName: fileUpload.file.name, imageKey: key });
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload, key: string): void {
    this.db.database.ref(this.basePath).child(key).set(fileUpload);
  }

  updateFileStorage(fileUpload: FileUpload, keyProduct: string, keyFile: string, nameFile: string): Observable<number | undefined> {

    this.deleteFile(keyFile, nameFile);

    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.updateFileData(keyFile, fileUpload);
          this.updateProduct(keyProduct, { imageURL: downloadURL, imageName: fileUpload.file.name, imageKey: keyProduct });
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  updateFileData(key: string, value: any): void {
    this.db.list(this.basePath).update(key, value);
  }

  deleteFile(key: string, name: string): void {
    this.deleteFileDatabase(key)
      .then(() => {
        this.deleteFileStorage(name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }

  public getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    })
  }
}
