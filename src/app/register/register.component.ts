import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../_helpers/validator'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
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
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [PasswordValidator.validate('password', 'confirmPassword')]
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

    this.authService.register(this.form.value['username'], this.form.value['email'], this.form.value['password'])
      .subscribe({
        next: (data) => {
          console.log(data)
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        error: (e) => {
          this.errorMessage = e.error.message;
          this.isSignUpFailed = true;
          console.log(this.errorMessage)
        },
        complete: () => console.info('Registration Successful')
      });
  }

  onReset(): void {
    this.submitted = false;
    this.isSignUpFailed = false;
    this.form.reset();
  }
}