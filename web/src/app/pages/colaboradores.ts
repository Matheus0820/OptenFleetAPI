import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, mensagemErro } from '../core/api';
import { Auth } from '../core/auth';
import { Colaborador, Usuario } from '../core/models';
import { Alerta, Modal } from '../shared/ui';

const FUNCOES = ['Ajudante', 'Técnico', 'Engenheiro', 'Estagiário'];
const pad = (h: number) => String(h).padStart(2, '0') + ':00';

@Component({
  selector: 'app-colaboradores',
  imports: [FormsModule, Alerta, Modal],
  template: `
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white">Recursos Humanos</h2>
      @if (auth.ehGestor()) { <button class="btn-primary" type="button" (click)="abrir()">+ Novo Colaborador</button> }
    </div>
    <app-alerta [texto]="erro()" />
    <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      @for (c of itens(); track c.id) {
        <div class="card rounded-[32px] p-6">
          <div class="mb-4 flex items-start justify-between">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-black text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">{{ (c.nome || '?').charAt(0) }}</div>
            @if (auth.ehGestor()) { <button class="text-gray-300 transition-colors hover:text-red-500" type="button" [attr.aria-label]="'Remover ' + c.nome" (click)="remover(c)">🗑</button> }
          </div>
          <h3 class="text-lg font-black leading-tight text-gray-800 dark:text-white">{{ c.nome }}</h3>
          <span class="text-[10px] font-black uppercase tracking-widest text-emerald-500">{{ c.funcao }}</span>
          <div class="mt-6 space-y-2 border-t border-gray-50 pt-4 dark:border-gray-800">
            <div class="flex justify-between text-xs"><span class="text-gray-400">Jornada</span><span class="font-bold dark:text-gray-300">{{ hora(c.horaInicioExpediente) }} - {{ hora(c.horaFimExpediente) }}</span></div>
            <div class="flex justify-between text-xs"><span class="text-gray-400">Semanal</span><span class="font-bold dark:text-gray-300">{{ c.cargaSemanalHoras }}h</span></div>
          </div>
        </div>
      } @empty { <p class="text-sm text-gray-400">Nenhum colaborador cadastrado.</p> }
    </div>

    @if (aberto()) {
      <app-modal titulo="Novo Colaborador" (fechar)="aberto.set(false)">
        <form class="space-y-4" (ngSubmit)="salvar()">
          <div>
            <label class="label" for="usr">Usuário (nível Colaborador)</label>
            <select id="usr" class="input" name="usr" [(ngModel)]="f.user_id">
              @for (u of disponiveis(); track u.id) { <option [value]="u.id">{{ u.nome }} — {{ u.email }}</option> }
              <option value="">➕ Criar novo usuário…</option>
            </select>
          </div>
          @if (!f.user_id) {
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2"><label class="label" for="n">Nome</label><input id="n" class="input" name="n" [(ngModel)]="f.nome" required /></div>
              <div><label class="label" for="e">E-mail</label><input id="e" class="input" type="email" name="e" [(ngModel)]="f.email" required /></div>
              <div><label class="label" for="s">Senha inicial</label><input id="s" class="input" type="password" name="s" [(ngModel)]="f.senha" required minlength="6" /></div>
            </div>
          }
          <div class="grid grid-cols-2 gap-4">
            <div><label class="label" for="fn">Função</label><select id="fn" class="input" name="fn" [(ngModel)]="f.funcao">@for (x of funcoes; track x) { <option>{{ x }}</option> }</select></div>
            <div><label class="label" for="hi">Início do expediente (h)</label><input id="hi" class="input" type="number" min="0" max="23" name="hi" [(ngModel)]="f.horaInicioExpediente" required /></div>
          </div>
          <p class="text-[11px] text-gray-400">Jornada: 8h (Ajudante, Técnico, Engenheiro) ou 6h (Estagiário). O fim do expediente é calculado.</p>
          <app-alerta [texto]="erroModal()" />
          <button class="btn-primary w-full justify-center" type="submit" [disabled]="salvando()">{{ salvando() ? 'Salvando…' : 'Salvar colaborador' }}</button>
        </form>
      </app-modal>
    }`,
})
export class Colaboradores {
  private api = inject(Api);
  auth = inject(Auth);
  funcoes = FUNCOES;
  hora = pad;
  itens = signal<Colaborador[]>([]);
  usuarios = signal<Usuario[]>([]);
  erro = signal(''); erroModal = signal('');
  aberto = signal(false); salvando = signal(false);
  f: any = {};

  // Usuários Colaborador que ainda não têm cadastro de colaborador.
  disponiveis = computed(() => {
    const usados = new Set(this.itens().map((c) => c.user_id));
    return this.usuarios().filter((u) => u.nivelAcesso === 'Colaborador' && !usados.has(u.id));
  });

  constructor() { this.carregar(); }

  carregar() {
    this.api.list<Colaborador>('colaboradores').subscribe({ next: (r) => this.itens.set(r), error: (e) => this.erro.set(mensagemErro(e)) });
    if (this.auth.ehGestor()) this.api.list<Usuario>('usuarios').subscribe((r) => this.usuarios.set(r));
  }

  abrir() {
    this.f = { user_id: this.disponiveis()[0]?.id ?? '', funcao: 'Técnico', horaInicioExpediente: 8, nome: '', email: '', senha: '' };
    this.erroModal.set(''); this.aberto.set(true);
  }

  salvar() {
    this.salvando.set(true); this.erroModal.set('');
    const falha = (e: unknown) => { this.erroModal.set(mensagemErro(e)); this.salvando.set(false); };
    const criarColaborador = (user_id: string) =>
      this.api.create('colaboradores', { user_id, funcao: this.f.funcao, horaInicioExpediente: this.f.horaInicioExpediente }).subscribe({
        next: () => { this.aberto.set(false); this.salvando.set(false); this.carregar(); },
        error: falha,
      });

    if (this.f.user_id) { criarColaborador(this.f.user_id); return; }
    // Gestor autenticado cria o usuário como Colaborador e em seguida o cadastro de colaborador.
    this.api.create<Usuario>('usuarios', { nome: this.f.nome, email: this.f.email, senha: this.f.senha, nivelAcesso: 'Colaborador' })
      .subscribe({ next: (u) => criarColaborador(u.id), error: falha });
  }

  remover(c: Colaborador) {
    if (!confirm(`Remover ${c.nome} da equipe? (o usuário de acesso é mantido)`)) return;
    this.api.remove('colaboradores', c.id).subscribe({ next: () => this.carregar(), error: (e) => this.erro.set(mensagemErro(e)) });
  }
}
