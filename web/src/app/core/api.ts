import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

/** Acesso à API REST (o token é adicionado pelo interceptor). */
@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  list<T>(recurso: string) { return this.http.get<T[]>(`/api/${recurso}`); }
  get<T>(caminho: string) { return this.http.get<T>(`/api/${caminho}`); }
  create<T>(recurso: string, corpo: unknown) { return this.http.post<T>(`/api/${recurso}`, corpo); }
  remove<T>(recurso: string, id: string) { return this.http.delete<T>(`/api/${recurso}/${id}`); }
}

/** Mensagem amigável a partir do erro HTTP da API (message ou lista de validação). */
export function mensagemErro(e: any): string {
  const corpo = e?.error;
  if (corpo?.erros?.length) return corpo.erros.map((x: any) => x.msg).join(' · ');
  return corpo?.message ?? (e?.status === 0 ? 'Sem conexão com o servidor.' : 'Ocorreu um erro inesperado.');
}
