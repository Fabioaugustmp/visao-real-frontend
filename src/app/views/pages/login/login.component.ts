import { Component, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Import reactive forms modules
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../../services/auth.service'; // Import AuthService
import { LoginResponse } from '../../../models/auth/login-response.model'; // Import LoginResponse

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true, // Mark as standalone
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    ReactiveFormsModule // Add ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Declare loginForm

  constructor(
    private fb: FormBuilder, // Inject FormBuilder
    private authService: AuthService, // Inject AuthService
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful', response);

          // Validate user has at least one valid role
          const validRoles = ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR', 'MEDICO', 'ROLE_MEDICO'];
          this.authService.getUserRoles().subscribe(userRoles => {
            const hasValidRole = userRoles.some(role => validRoles.includes(role));

            if (!hasValidRole) {
              console.error('User does not have any valid roles');
              alert('Acesso negado: Seu usuário não possui permissões válidas para acessar o sistema.');
              this.authService.logout();
              return;
            }

            // User has valid role, proceed to dashboard
            this.router.navigate(['/']); // Redirect to root, AuthGuard will handle further redirection
          });
        },
        error: (error: any) => {
          console.error('Login failed', error);
          // TODO: Display error message to the user
        }
      });
    } else {
      console.log('Form is invalid');
      // TODO: Display validation errors
    }
  }
}
