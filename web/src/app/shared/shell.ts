import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../core/auth';

const TEMA = 'opten.tema';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen overflow-x-hidden text-gray-800 transition-colors dark:text-gray-200">
      @if (menuAberto()) {
        <div class="fixed inset-0 z-40 bg-black/50 lg:hidden" (click)="menuAberto.set(false)"></div>
      }

      <aside class="fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0"
             [class.translate-x-0]="menuAberto()" [class.-translate-x-full]="!menuAberto()">
        <div class="flex items-center justify-between border-b border-gray-50 p-8 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-emerald-500 p-1.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <span class="text-xl font-bold dark:text-white">Opt.en <span class="text-sm font-light text-emerald-500">Fleet</span></span>
          </div>
          <button type="button" class="p-1 text-gray-400 lg:hidden" aria-label="Fechar menu" (click)="menuAberto.set(false)">✕</button>
        </div>
        <nav class="mt-6" aria-label="Principal">
          @for (item of itens(); track item.rota) {
            <a [routerLink]="item.rota" routerLinkActive="active-link" (click)="menuAberto.set(false)"
               class="flex w-full items-center gap-4 px-8 py-4 text-sm text-gray-400 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400">
              <span aria-hidden="true">{{ item.icone }}</span><span>{{ item.rotulo }}</span>
            </a>
          }
        </nav>
      </aside>

      <main class="w-full max-w-full flex-1 p-6 md:p-12">
        <header class="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div class="flex items-center gap-4">
            <button type="button" class="rounded-xl border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:hidden" aria-label="Abrir menu" (click)="menuAberto.set(true)">☰</button>
            <div>
              <h1 class="text-2xl font-bold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl">Fleet Manager</h1>
              <p class="mt-1 text-xs text-gray-400">{{ auth.usuario()?.nome }} • {{ auth.usuario()?.nivelAcesso }}</p>
            </div>
          </div>
          <div class="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <button type="button" (click)="alternarTema()" [attr.aria-label]="escuro() ? 'Modo claro' : 'Modo escuro'"
                    class="rounded-xl border border-gray-100 bg-white p-2.5 text-gray-500 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
              {{ escuro() ? '☀️' : '🌙' }}
            </button>
            <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-2 px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Sistema Ativo</span>
            </div>
            <button type="button" class="text-xs font-bold text-gray-400 hover:text-red-500" (click)="auth.logout()">Sair</button>
          </div>
        </header>
        <div class="animate-fadeIn"><router-outlet /></div>
      </main>
    </div>`,
})
export class Shell {
  auth = inject(Auth);
  menuAberto = signal(false);
  escuro = signal(this.temaSalvo());

  itens = () => {
    const base = [
      { rota: '/dashboard', rotulo: 'Visão Geral', icone: '▦' },
      ...(this.auth.ehGestor() ? [{ rota: '/veiculos', rotulo: 'Gestão de Veículos', icone: '🚚' }] : []),
      { rota: '/colaboradores', rotulo: 'Funcionários', icone: '👥' },
      { rota: '/clientes', rotulo: 'Clientes', icone: '☀' },
      { rota: '/rotas', rotulo: 'Gestão de Rotas', icone: '📍' },
      ...(this.auth.ehGestor() ? [{ rota: '/relatorios', rotulo: 'Relatórios', icone: '📊' }] : []),
    ];
    return base;
  };

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this.escuro());
      try { localStorage.setItem(TEMA, this.escuro() ? 'escuro' : 'claro'); } catch { /* ignore */ }
    });
  }

  alternarTema() { this.escuro.update((v) => !v); }

  private temaSalvo() {
    try { return localStorage.getItem(TEMA) === 'escuro'; } catch { return false; }
  }
}
