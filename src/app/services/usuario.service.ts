import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../auth/usuario';
import { UserUpdateResponse } from '../models/user-update-response';
import { environment } from '../../environments/environment';
import { UserRequest } from '../auth/user-request';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  API = environment.SERVIDOR+'/api/usuario';

  constructor(private http: HttpClient) {}

  //CRUD - Create - save
  saveUsuario(usuario: UserRequest): Observable<string> {
    return this.http.post<string>(`${this.API}/save`, usuario, {
      responseType: 'text' as 'json',
    });
  }

  //CRUD - Read - findAll
  findAll(ativo: boolean = true): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}/findAll?ativo=${ativo}`);
  }

  //CRUD - Read - findById
  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/findById/${id}`); //API dentro do metodo
  }

  //CRUD - Read - findByLogin
  findByLogin(login: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/findByLogin/${login}`); //API dentro do metodo
  }

  //CRUD - Update - update
  updateUsuario(usuario: UserRequest, id: number): Observable<UserUpdateResponse> {
    return this.http.put<UserUpdateResponse>(`${this.API}/update/${id}`, usuario);
  }

  //CRUD - Delete - delete
  deleteUsuario(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API}/delete/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  //CRUD - Desativar - disable
  desativarUsuario(id: number): Observable<string> {
    return this.http.put<string>(
      `${this.API}/disable/${id}`,
      {},
      {
        responseType: 'text' as 'json',
      }
    );
  }

  //CRUD - Ativar - enable
  ativarUsuario(id: number): Observable<string> {
    return this.http.put<string>(
      `${this.API}/enable/${id}`,
      {},
      {
        responseType: 'text' as 'json',
      }
    );
  }
}
