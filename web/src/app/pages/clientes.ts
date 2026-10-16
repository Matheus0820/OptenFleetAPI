import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, mensagemErro } from '../core/api';
import { Auth } from '../core/auth';
import { Cliente } from '../core/models';
import { Alerta, Modal } from '../shared/ui';

const vazio = () => ({ nome: '', tipoServico: 'Instalação', urlMaps: '', latitude: null, longitude: null, demanda: 1, tempoServicoMin: null, prazoDias: null, janelaInicio: 8, janelaFim: 17 });

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, Alerta, Modal],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white">Clientes a Atender</h2>
      @if (auth.ehGestor()) { <button class="btn-primary" type="button" (click)="abrir()">+ Novo Cliente</button> }
    </div>
    <app-alerta [texto]="erro()" />
    <div class="card mt-4 overflow-x-auto">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:bg-gray-800">
          <tr><th class="th">Cliente</th><th class="th">Serviço</th><th class="th">Atendimento</th><th class="th">Janela</th><th class="th">Mapa</th>@if (auth.ehGestor()) { <th class="th text-center">Ações</th> }</tr>
        </thead>
        <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
          @for (c of itens(); track c.id) {
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 font-bold dark:text-white">{{ c.nome }}<span class="block text-[10px] font-normal text-gray-400">{{ c.latitude }}, {{ c.longitude }}</span></td>
              <td class="px-6 py-4"><span class="badge">{{ c.tipoServico }}</span></td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ c.tempoServicoMin }} min · demanda {{ c.demanda }}@if (c.prazoDias) { · prazo {{ c.prazoDias }}d }</td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ c.janelaInicio }}h–{{ c.janelaFim }}h</td>
              <td class="px-6 py-4"><a [href]="c.urlMaps" target="_blank" rel="noopener noreferrer" class="text-xs font-bold uppercase tracking-tighter text-blue-500 hover:underline dark:text-blue-400">Google Maps ↗</a></td>
              @if (auth.ehGestor()) { <td class="px-6 py-4 text-center"><button class="p-2 text-red-300 hover:text-red-500" type="button" [attr.aria-label]="'Remover ' + c.nome" (click)="remover(c)"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></svg></button></td> }
            </tr>
          } @empty { <tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">Nenhum cliente cadastrado.</td></tr> }
        </tbody>
      </table>
    </div>

    @if (aberto()) {
      <app-modal titulo="Novo Cliente" (fechar)="aberto.set(false)">
        <form class="grid grid-cols-2 gap-4" (ngSubmit)="salvar()">
          <div class="col-span-2"><label class="label" for="nome">Nome</label><input id="nome" class="input" name="nome" [(ngModel)]="f.nome" required /></div>
          <div class="col-span-2"><label class="label" for="tipo">Tipo de serviço</label>
            <select id="tipo" class="input" name="tipo" [(ngModel)]="f.tipoServico"><option>Instalação</option><option>Manutenção</option></select></div>
          <div class="col-span-2"><label class="label" for="url">URL do Google Maps</label><input id="url" class="input" type="url" name="url" [(ngModel)]="f.urlMaps" required placeholder="https://www.google.com/maps/place/…/@-5.84,-35.19,17z" />
            <p class="mt-1 text-[11px] text-gray-400">Use o link completo (as coordenadas são extraídas dele). Links curtos exigem lat/long abaixo.</p></div>
          <div><label class="label" for="lat">Latitude (opcional)</label><input id="lat" class="input" type="number" step="any" name="lat" [(ngModel)]="f.latitude" /></div>
          <div><label class="label" for="lng">Longitude (opcional)</label><input id="lng" class="input" type="number" step="any" name="lng" [(ngModel)]="f.longitude" /></div>
          <div><label class="label" for="tempo">Tempo de serviço (min)</label><input id="tempo" class="input" type="number" min="5" name="tempo" [(ngModel)]="f.tempoServicoMin" placeholder="Instalação 120 · Manutenção 60" /></div>
          <div><label class="label" for="prazo">Prazo (dias úteis)</label><input id="prazo" class="input" type="number" min="1" name="prazo" [(ngModel)]="f.prazoDias" placeholder="Sem prazo" /></div>
          <div><label class="label" for="dem">Demanda</label><input id="dem" class="input" type="number" min="1" name="dem" [(ngModel)]="f.demanda" /></div>
          <div><label class="label" for="ji">Janela: início (h)</label><input id="ji" class="input" type="number" min="0" max="23" name="ji" [(ngModel)]="f.janelaInicio" /></div>
          <div><label class="label" for="jf">Janela: fim (h)</label><input id="jf" class="input" type="number" min="1" max="24" name="jf" [(ngModel)]="f.janelaFim" /></div>
          <div class="col-span-2 space-y-3">
            <app-alerta [texto]="erroModal()" />
            <button class="btn-primary w-full justify-center" type="submit" [disabled]="salvando()">{{ salvando() ? 'Salvando…' : 'Salvar cliente' }}</button>
          </div>
        </form>
      </app-modal>
    }`,
})
export class Clientes {
  private api = inject(Api);
  auth = inject(Auth);
  itens = signal<Cliente[]>([]);
  erro = signal(''); erroModal = signal('');
  aberto = signal(false); salvando = signal(false);
  f: any = vazio();

  constructor() { this.carregar(); }

  carregar() { this.api.list<Cliente>('clientes').subscribe({ next: (r) => this.itens.set(r), error: (e) => this.erro.set(mensagemErro(e)) }); }
  abrir() { this.f = vazio(); this.erroModal.set(''); this.aberto.set(true); }

  salvar() {
    this.salvando.set(true); this.erroModal.set('');
    // Campos opcionais vazios não são enviados (a API aplica os padrões).
    const corpo = Object.fromEntries(Object.entries(this.f).filter(([, v]) => v !== null && v !== ''));
    this.api.create('clientes', corpo).subscribe({
      next: () => { this.aberto.set(false); this.salvando.set(false); this.carregar(); },
      error: (e) => { this.erroModal.set(mensagemErro(e)); this.salvando.set(false); },
    });
  }

  remover(c: Cliente) {
    if (!confirm(`Remover o cliente ${c.nome}?`)) return;
    this.api.remove('clientes', c.id).subscribe({ next: () => this.carregar(), error: (e) => this.erro.set(mensagemErro(e)) });
  }
}
