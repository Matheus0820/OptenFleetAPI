import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../core/auth';
import { mensagemErro } from '../core/api';
import { Alerta } from '../shared/ui';

@Component({
  selector: 'app-login',
  imports: [FormsModule, Alerta],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-[#F9FBF9] p-4 dark:bg-gray-950">
      <form class="card animate-fadeIn w-full max-w-md space-y-5 p-10" (ngSubmit)="enviar()">
        <div class="text-center">
          <img src="logo.png" alt="Opt.en" class="mx-auto mb-3 h-14" />
          <h1 class="text-2xl font-bold dark:text-white">Opt.en <span class="text-base font-light text-emerald-500">Fleet</span></h1>
          <p class="mt-1 text-xs text-gray-400">{{ cadastro() ? 'Crie sua conta de colaborador' : 'Acesse sua conta' }}</p>
        </div>

        @if (cadastro()) {
          <div><label class="label" for="nome">Nome</label><input id="nome" class="input" name="nome" [(ngModel)]="nome" required minlength="2" /></div>
        }
        <div><label class="label" for="email">E-mail</label><input id="email" class="input" type="email" name="email" [(ngModel)]="email" required autocomplete="username" /></div>
        <div>
          <label class="label" for="senha">Senha</label>
          <input id="senha" class="input" type="password" name="senha" [(ngModel)]="senha" required minlength="6" [attr.autocomplete]="cadastro() ? 'new-password' : 'current-password'" />
          @if (cadastro()) { <p class="mt-1 text-[11px] text-gray-400">Mínimo 6 caracteres, com ao menos um número.</p> }
        </div>

        <app-alerta [texto]="erro()" />
        <app-alerta [texto]="info()" tipo="aviso" />

        <button class="btn-primary w-full justify-center" type="submit" [disabled]="enviando()">
          {{ enviando() ? 'Aguarde…' : cadastro() ? 'Criar conta' : 'Entrar' }}
        </button>
        <button type="button" class="w-full text-center text-xs font-bold text-emerald-600 hover:underline" (click)="alternar()">
          {{ cadastro() ? 'Já tenho conta' : 'Criar conta de colaborador' }}
        </button>
      </form>
    </div>`,
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  cadastro = signal(false);
  enviando = signal(false);
  erro = signal('');
  info = signal('');
  nome = ''; email = ''; senha = '';

  alternar() { this.cadastro.update((v) => !v); this.erro.set(''); this.info.set(''); }

  enviar() {
    this.erro.set(''); this.info.set(''); this.enviando.set(true);
    const falha = (e: unknown) => { this.erro.set(mensagemErro(e)); this.enviando.set(false); };

    if (this.cadastro()) {
      this.auth.cadastrar(this.nome, this.email, this.senha).subscribe({
        next: () => { this.info.set('Conta criada! Faça login para continuar.'); this.cadastro.set(false); this.enviando.set(false); },
        error: falha,
      });
    } else {
      this.auth.login(this.email, this.senha).subscribe({ next: () => this.router.navigateByUrl('/dashboard'), error: falha });
    }
  }
}
