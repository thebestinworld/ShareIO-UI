import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  username: any;
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.username = this.tokenStorage.getUser().username;
    }
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ]
      }
    );
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.authService.login(this.form.value['username'], this.form.value['password']).subscribe({
      next: (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveRefreshToken(data.refreshToken);
        this.tokenStorage.saveUser(data);
        this.reloadPage();
      },
      error: (e) => {
        console.error(e)
        this.errorMessage = e.error.message;
        this.isLoggedIn = false;
        this.isLoginFailed = true;
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  reloadPage(): void {
    window.location.reload();
  }
}