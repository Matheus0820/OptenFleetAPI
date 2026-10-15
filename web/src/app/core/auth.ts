import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { Usuario } from './models';

const CHAVE = 'opten.sessao';
type Sessao = { token: string; usuario: Usuario };

const expirado = (token: string) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !exp || exp * 1000 < Date.now();
  } catch { return true; }
};

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sessao = signal<Sessao | null>(this.ler());

  readonly usuario = computed(() => this.sessao()?.usuario ?? null);
  readonly token = computed(() => this.sessao()?.token ?? null);
  readonly logado = computed(() => !!this.sessao());
  readonly ehGestor = computed(() => this.usuario()?.nivelAcesso === 'Gestor');

  private ler(): Sessao | null {
    try {
      const s: Sessao | null = JSON.parse(localStorage.getItem(CHAVE) ?? 'null');
      return s && !expirado(s.token) ? s : null;
    } catch { return null; }
  }

  login(email: string, senha: string) {
    return this.http.post<{ token_user: string; usuario: Usuario }>('/api/login', { email, senha }).pipe(
      tap((r) => {
        const s = { token: r.token_user, usuario: r.usuario };
        this.sessao.set(s);
        try { localStorage.setItem(CHAVE, JSON.stringify(s)); } catch { /* armazenamento indisponível */ }
      }),
    );
  }

  cadastrar(nome: string, email: string, senha: string) {
    return this.http.post<Usuario>('/api/usuarios', { nome, email, senha });
  }

  logout() {
    this.sessao.set(null);
    try { localStorage.removeItem(CHAVE); } catch { /* ignore */ }
    this.router.navigateByUrl('/login');
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.token();
  const autenticada = token && req.url.startsWith('/api/') && !req.url.endsWith('/login');
  const chamada = autenticada ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(chamada).pipe(
    catchError((e) => {
      if (e.status === 401 && autenticada) auth.logout(); // token expirado/inválido
      return throwError(() => e);
    }),
  );
};

export const authGuard: CanActivateFn = () =>
  inject(Auth).logado() || inject(Router).createUrlTree(['/login']);

export const gestorGuard: CanActivateFn = () =>
  inject(Auth).ehGestor() || inject(Router).createUrlTree(['/dashboard']);
