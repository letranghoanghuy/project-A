import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'src/app/models/product.model';
import { ServerService } from 'src/app/services/server.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;

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

  constructor(private serverService: ServerService) { }

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
  }

  public createProduct(): void {
    var key = this.productForm.value.name.normalize('NFD').replace(/\s/g, '-').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    this.serverService.createProduct(this.productForm.value, key).then(() => {
      console.log('success');
      this.productForm.reset();
      this.imgThumb = null;
    })

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.serverService.pushFileToStorage(this.currentFileUpload, key).subscribe(
          percentage => {
            // this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
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