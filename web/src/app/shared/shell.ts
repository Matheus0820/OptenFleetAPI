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
            <img src="logo.png" alt="Opt.en Fleet" class="h-11 w-11 object-contain rounded-[11px]" />
            <span class="text-xl font-bold dark:text-white">Opt.en <span class="text-sm font-light text-emerald-500">Fleet</span></span>
          </div>
          <button type="button" class="p-1 text-gray-400 lg:hidden" aria-label="Fechar menu" (click)="menuAberto.set(false)"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg></button>
        </div>
        <nav class="mt-6" aria-label="Principal">
          @for (item of itens(); track item.rota) {
            <a [routerLink]="item.rota" routerLinkActive="active-link" (click)="menuAberto.set(false)"
               class="flex w-full items-center gap-4 px-8 py-4 text-sm text-gray-400 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400">
              <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                @switch (item.icone) {
                  @case ('dashboard') { <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/> }
                  @case ('truck') { <path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/> }
                  @case ('users') { <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/> }
                  @case ('customer') { <circle cx="12" cy="8" r="5"/><path d="M3 21a9 9 0 0 1 18 0"/> }
                  @case ('pin') { <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/> }
                  @case ('chart') { <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/> }
                }
              </svg><span>{{ item.rotulo }}</span>
            </a>
          }
        </nav>
      </aside>

      <main class="w-full max-w-full flex-1 p-6 md:p-12">
        <header class="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div class="flex items-center gap-4">
            <button type="button" class="rounded-xl border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:hidden" aria-label="Abrir menu" (click)="menuAberto.set(true)"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
            <div>
              <h1 class="text-2xl font-bold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl">Fleet Manager</h1>
              <p class="mt-1 text-xs text-gray-400">{{ auth.usuario()?.nome }} • {{ auth.usuario()?.nivelAcesso }}</p>
            </div>
          </div>
          <div class="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <button type="button" (click)="alternarTema()" [attr.aria-label]="escuro() ? 'Modo claro' : 'Modo escuro'"
                    class="rounded-xl border border-gray-100 bg-white p-2.5 text-gray-500 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                @if (escuro()) { <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/> }
                @else { <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/> }
              </svg>
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
      { rota: '/dashboard', rotulo: 'Visão Geral', icone: 'dashboard' },
      ...(this.auth.ehGestor() ? [{ rota: '/veiculos', rotulo: 'Gestão de Veículos', icone: 'truck' }] : []),
      { rota: '/colaboradores', rotulo: 'Funcionários', icone: 'users' },
      { rota: '/clientes', rotulo: 'Clientes', icone: 'customer' },
      { rota: '/rotas', rotulo: 'Gestão de Rotas', icone: 'pin' },
      ...(this.auth.ehGestor() ? [{ rota: '/relatorios', rotulo: 'Relatórios', icone: 'chart' }] : []),
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
