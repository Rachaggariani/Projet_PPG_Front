import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/LoginRequest';
import { AuthService } from '../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private changeDetectorRef: ChangeDetectorRef, private toastr: ToastrService) { }
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
  this.signInFormSubmitted = true;

  if (!this.signinForm.invalid) {
    const loginData: LoginRequest = this.signinForm.value;

    this.authService.authenticate(loginData).subscribe({
      next: () => {
        localStorage.setItem('currentUser', JSON.stringify({
          username: loginData.username, 
        }));
        this.router.navigate(['/home']);
        this.invalidLogin = false;
      },
      error: (err: any) => {
        this.invalidLogin = true;
        console.error('❌ Échec de la connexion :', err);

        const errorMessage = err?.error?.message || 'Identifiants incorrects ou erreur serveur.';

        this.toastr.error(
          `<span class="toast-msg">${errorMessage}</span>`,
          '',
          {
            timeOut: 26000,
            progressBar: true,
            closeButton: true,
            enableHtml: true
          }
        );
      }
    });
  }
}


onSignUp() {
  this.signUpFormSubmitted = true;

  if (!this.signupForm.invalid) {
    const formData = {
      ...this.signupForm.value,
      role: [this.signupForm.value.role] // Convertir en tableau
    };

    this.authService.register(formData).subscribe({
      next: res => {
        this.toastr.success(
          '<span class="toast-msg">✅ Inscription réussie</span>',
          '',
          {
            timeOut: 6000,
            progressBar: true,
            enableHtml: true
          }
        );
        this.invalidUser = false;
        this.toggleForm(); // pour revenir à l'écran login
      },

      error: err => {
        this.invalidUser = true;

        const errorMessage = err?.error?.message || '❌ Une erreur inconnue est survenue.';

        this.toastr.error(
          `<span class="toast-msg">${errorMessage}</span>`,
          '',
          {
            timeOut: 27000,
            progressBar: true,
            closeButton: true,
            enableHtml: true
          }
        );

        console.error("Erreur lors de l'inscription :", err);
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
  allowOnlyDigits(event: KeyboardEvent) {
  const inputChar = event.key;
  if (!/^\d$/.test(inputChar)) {
    event.preventDefault(); // empêche les lettres ou caractères spéciaux
  }
}
// Add to your AuthService
private currentUserSubject = new BehaviorSubject<any>(null);


getCurrentUser(): { username: string, name?: string } {
  return {
    username: sessionStorage.getItem('username') || '',
  };
}
}
