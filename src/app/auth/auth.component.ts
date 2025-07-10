import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/LoginRequest';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isSignIn = true;
  signupForm!: FormGroup;
  signinForm!: FormGroup;
  successMessage = "Authentication success";
  errorMessage = "Invalide username or password";
  invalidLogin = false;
  invalidUser = false;
  adminRole: boolean | null = null; 
  signUpFormSubmitted: boolean = false;
  signInFormSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit() {
    // Formulaire de connexion
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      role:['client'],
    });

    // Formulaire d'inscription
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Validation email
      role:['client'],
      password: ['', [
        Validators.required,
        Validators.minLength(8), // Minimum 8 caractères
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$') // Password fort
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^\\d{8}$') // Validation pour 8 chiffres
      ]]
    });
  }

  onSignIn() {
    this.signInFormSubmitted =true;
    if (!this.signinForm.invalid) {
      const loginData: LoginRequest = this.signinForm.value;
      this.authService.authenticate(loginData).subscribe({
        next: () => {
          this.router.navigate(['/home']);
          this.invalidLogin = false;
        },
        error: (err: any) => {
          this.invalidLogin = true
          console.error('Login failed', err);
          // tu peux afficher un message d'erreur ici
        }
      });
    }
  }

  onSignUp() {
    this.signUpFormSubmitted = true;
    if (!this.signupForm.invalid) {
      //const signupData: SignupRequest = this.signupForm.value;
      const formData = {
        ...this.signupForm.value,
        role: [this.signupForm.value.role] // Convertir en tableau
      };
      this.authService.register(formData).subscribe({
        next: res => {
          console.log('Inscription réussie');
          this.invalidUser = false
          this.toggleForm(); // pour revenir à l'écran login
        },
        error: err => {
          this.invalidUser = true;
          console.error('Erreur lors de l’inscription', err);
        }
      });
    }
  }

  toggleForm() {
    this.isSignIn = !this.isSignIn;
  }

  CheckboxChange(e: any) {
    this.adminRole = e.target.value === 'admin';
    this.signinForm.get('role')?.setValue(e.target.value);
    this.signupForm.get('role')?.setValue(e.target.value);
    //this.changeDetectorRef.detectChanges()
  }
}
