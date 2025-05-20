import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Login } from '../../../auth/login';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../../auth/login.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: Login = new Login();

  router = inject(Router);
  loginService = inject(LoginService);
  alertService = inject(AlertService);

  // ViewChild para capturar o campo de senha
  @ViewChild('passwordField') passwordField!: ElementRef<HTMLInputElement>;

  logar() {
  if (!this.login.username || !this.login.password) {
    this.alertService.showAlert('Por favor, preencha todos os campos.', 'error');
    return;
  }

  this.loginService.logar(this.login).subscribe({
    next: (token) => {
      if (token) {
        this.loginService.addToken(token);
        this.alertService.showToast('Login realizado com sucesso!', 'success');
        
        // Chama o método para preencher o usuário após o login
        this.loginService.getUserFromToken().subscribe({
          next: (usuario) => {
            // O usuário foi recuperado com sucesso

            // Aqui, você pode navegar com base na role do usuário
            if (usuario.role === 'GESTOR') {
              this.router.navigate(['blackcat/dashboard']);
            } else if (usuario.role === 'FUNCIONARIO') {
              this.router.navigate(['blackcat/funcionario']);
            } else {
              this.alertService.showAlert('Acesso não autorizado', 'error');
              console.log("O erro não é no guard")
              this.router.navigate(['invalid-access']);
            }
          },
          error: (erro) => {
            this.alertService.showErrorAlert(erro);
          }
        });
      }
    },
    error: (erro) => {
      if (erro.status === 401 || erro.error.contains("401")) {
        this.alertService.showAlert('Usuário ou senha incorretos.', 'error');
      } else {
        this.alertService.showErrorAlert(erro);
      }
    }
  });
}


  // Função para avançar o foco para o próximo campo
  focusNext(): void {
    this.passwordField.nativeElement.focus();
  }

  autenticar() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  }
}
