import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from 'src/app/services/server.service';
import Product, { FileUpload } from 'src/app/models/product.model';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productKey: any;
  productForm: FormGroup;
  product?: Product;

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;

  imgThumb: any;
  base64: any = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '500px',
    minHeight: '500px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: 'auto',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  constructor(private serverService: ServerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      imageKey: new FormControl('null'),
      imageName: new FormControl('null'),
      imageURL: new FormControl('null'),
      publish: new FormControl(true),
      description: new FormControl('', [Validators.required])
    });
    this.productKey = this.route.snapshot.params['key'];
    this.getProduct(this.productKey);
  }

  getProduct(key: string): void {
    this.serverService.getProduct(key).valueChanges().subscribe((data) => {
      this.product = data;
      this.productForm.patchValue({
        name: this.product.name,
        price: this.product.price,
        imageKey: this.product.imageKey,
        imageName: this.product.imageName,
        imageURL: this.product.imageURL,
        publish: this.product.publish,
        description: this.product.description
      });
      this.imgThumb = this.product.imageURL;
    })
  }

  updateProduct(): void {
    this.serverService.updateProduct(this.productKey, this.productForm.value)
      .then(() => {
        this.productForm.reset();
        this.imgThumb = null;
      })
      .catch(err => console.log(err));

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.serverService.updateFileStorage
          (this.currentFileUpload, this.productKey, this.productForm.value.imageKey, this.productForm.value.imageName)
          .subscribe(
            percentage => {
              // this.percentage = Math.round(percentage ? percentage : 0);
            },
            error => {
              console.log(error);
            }
          );
      }
    }
    this.router.navigate(['/system/products']);
  }

  async selectFile(event: any) {
    this.selectedFiles = event.target.files;
    let data = event.target.files
    let file = data[0];

    this.base64 = await this.serverService.getBase64(file);
    let objectUrl = URL.createObjectURL(file)
    this.imgThumb = objectUrl
  }

}
