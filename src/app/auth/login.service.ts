import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Login } from './login';
import { Usuario } from './usuario';
import { environment } from '../../environments/environment';
import { KeycloakToken } from '../models/keycloak-token.model';
import { UsuarioService } from '../services/usuario.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  usuario!: Usuario;
  API = environment.SERVIDOR + '/api/auth';
  usuarioService = inject(UsuarioService);
  alertService = inject(AlertService);

  constructor() {}

  logar(login: Login): Observable<string> {
    return this.http.post<string>(this.API + '/login', login, {
      responseType: 'text' as 'json',
    });
  }

  addToken(token: string) {
    localStorage.setItem('token', token);
  }

  removerToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  jwtDecode() {
    let token = this.getToken();
    if (token) {
      return jwtDecode<KeycloakToken>(token);
    }
    return null;
  }

  hasPermission(role: string): boolean {
    const token = this.jwtDecode();
    if (!token) return false;

    return token.realm_access?.roles.includes(role) ?? false;
  }

  getRole(): string {

    if (this.hasPermission('COORD') || this.hasPermission('black-cat-role')) {
      return 'GESTOR';
    } else if (this.hasPermission('user-default')) {
      return 'FUNCIONARIO';
    }
    return '';
  }

  getUserFromToken(): Observable<Usuario> {
    const user = this.jwtDecode();
    if (!user) {
      return throwError(() => new Error('Token inválido'));
    }

    const login = user.preferred_username;
    return this.usuarioService.findByLogin(login).pipe(
      map((response) => {
        this.usuario = response;
        localStorage.setItem('usuario', JSON.stringify(response)); // <--- salva no localStorage
        return this.usuario;
      }),
      catchError((erro) => {
        this.alertService.showErrorToast(erro);
        return throwError(() => erro);
      })
    );
  }

  getUsuarioLogado(): Usuario {
    if (this.usuario) {
      return this.usuario;
    }

    const stored = localStorage.getItem('usuario');
    if (stored) {
      this.usuario = JSON.parse(stored);
      return this.usuario;
    }

    throw new Error('Usuário não encontrado. Faça login novamente.');
  }
}
