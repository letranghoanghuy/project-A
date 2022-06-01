import { ServerService } from './../../services/server.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = false;

  constructor(private router: Router, private server: ServerService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required])
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.server.login(this.loginForm.value.email, this.loginForm.value.password).then((result) => {
      if (result == null) {
        console.log("login success!!")
        this.router.navigate(['/system']);
      }
      else {
        this.errorMessage = true;
      }
    })
  }

}
