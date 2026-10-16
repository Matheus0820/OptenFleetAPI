import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, mensagemErro } from '../core/api';
import { Auth } from '../core/auth';
import { Horizonte, Rota } from '../core/models';
import { Alerta, Modal } from '../shared/ui';

const hoje = () => new Date().toISOString().slice(0, 10);
const h = (min: number) => `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;

@Component({
  selector: 'app-rotas',
  imports: [FormsModule, DatePipe, DecimalPipe, Alerta, Modal],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white">Planejamento de Destinos</h2>
      @if (auth.ehGestor()) { <button class="btn-dark" type="button" (click)="abrir()">+ Gerar Rota</button> }
    </div>
    <app-alerta [texto]="erro()" />

    <div class="card mt-4 overflow-x-auto">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:bg-gray-800">
          <tr><th class="px-8 py-5">Nome da Rota</th><th class="px-8 py-5">Execução</th><th class="px-8 py-5">Destinos</th><th class="px-8 py-5">Distância</th><th class="px-8 py-5">CO₂</th><th class="px-8 py-5"></th></tr>
        </thead>
        <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
          @for (r of itens(); track r.id) {
            <tr class="cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50" (click)="ver(r.id)">
              <td class="px-8 py-5 font-black text-gray-800 dark:text-white">{{ r.nome }}<span class="block text-[10px] font-normal text-gray-400">desde {{ r.dataInicio | date: 'dd/MM/yyyy' : 'UTC' }}</span></td>
              <td class="px-8 py-5"><span class="badge">{{ r.horizonte }}</span></td>
              <td class="px-8 py-5 font-medium text-gray-400">{{ r.resumo.atendidos }}/{{ r.resumo.destinos }} pontos</td>
              <td class="px-8 py-5 text-gray-500 dark:text-gray-400">{{ r.resumo.distanciaKm | number: '1.0-1' }} km</td>
              <td class="px-8 py-5 font-black text-emerald-600 dark:text-emerald-400">{{ r.resumo.co2Kg | number: '1.0-1' }} kg</td>
              <td class="px-8 py-5 text-right">
                @if (auth.ehGestor()) { <button class="p-2 text-red-300 hover:text-red-500" type="button" [attr.aria-label]="'Remover ' + r.nome" (click)="remover(r, $event)"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></svg></button> }
              </td>
            </tr>
          } @empty { <tr><td colspan="6" class="px-8 py-8 text-center text-gray-400">Nenhuma rota gerada ainda.</td></tr> }
        </tbody>
      </table>
    </div>

    @if (detalhe(); as r) {
      <section class="animate-fadeIn mt-8 space-y-6" aria-label="Detalhe da rota">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ r.nome }} <span class="badge ml-2">{{ r.horizonte }}</span></h3>
          <button class="text-xs font-bold text-gray-400 hover:text-gray-600" type="button" (click)="detalhe.set(null)">Fechar <svg class="ml-1 inline h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg></button>
        </div>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div class="card p-5"><p class="label">Distância</p><p class="text-2xl font-black dark:text-white">{{ r.resumo.distanciaKm | number: '1.0-1' }} km</p></div>
          <div class="card p-5"><p class="label">Em rota</p><p class="text-2xl font-black dark:text-white">{{ tempo(r.resumo.tempoMin) }}</p></div>
          <div class="card p-5"><p class="label">Combustível</p><p class="text-2xl font-black dark:text-white">{{ r.resumo.litros | number: '1.0-1' }} L</p></div>
          <div class="card p-5"><p class="label">CO₂ emitido</p><p class="text-2xl font-black dark:text-white">{{ r.resumo.co2Kg | number: '1.0-1' }} kg</p></div>
          <div class="rounded-3xl bg-emerald-500 p-5 text-white"><p class="text-[10px] font-black uppercase tracking-widest opacity-80">CO₂ evitado</p><p class="text-2xl font-black">{{ r.resumo.reducaoCo2Kg | number: '1.0-1' }} kg</p></div>
        </div>
        @if (r.fonteMatriz === 'haversine') {
          <app-alerta tipo="aviso" texto="Distâncias estimadas em linha reta (servidor de mapas indisponível no momento da geração). Gere novamente para usar distâncias reais por via." />
        }
        @if (r.naoAtendidos?.length) {
          <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-900/20">
            <p class="mb-2 text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Não atendidos neste horizonte ({{ r.naoAtendidos!.length }})</p>
            @for (n of r.naoAtendidos; track n.cliente) { <p class="text-sm text-amber-800 dark:text-amber-200"><b>{{ n.nome }}</b> — {{ n.motivo }}</p> }
          </div>
        }
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          @for (d of r.dias; track d.dia + d.placa) {
            <div class="card rounded-[32px] p-6">
              <div class="mb-4 flex items-start justify-between">
                <div>
                  <p class="text-sm font-black dark:text-white">Dia {{ d.dia }} · {{ d.data | date: 'EEE dd/MM' : 'UTC' }}</p>
                  <p class="text-[11px] text-gray-400">{{ d.modelo }} · {{ d.placa }} · {{ d.distanciaKm | number: '1.0-1' }} km · {{ d.co2Kg | number: '1.0-1' }} kg CO₂</p>
                </div>
                <a [href]="d.mapsUrl" target="_blank" rel="noopener noreferrer" class="text-xs font-bold uppercase tracking-tighter text-blue-500 hover:underline dark:text-blue-400">Google Maps ↗</a>
              </div>
              <ol class="space-y-2 border-l-2 border-emerald-200 pl-4 dark:border-emerald-900">
                @for (p of d.paradas; track p.cliente) {
                  <li class="text-sm"><span class="font-black text-emerald-600 dark:text-emerald-400">{{ p.chegada }}–{{ p.saida }}</span>
                    <span class="ml-2 font-bold dark:text-white">{{ p.nome }}</span> <span class="ml-2 text-[11px] text-gray-400">{{ p.tipoServico }}</span></li>
                }
              </ol>
            </div>
          }
        </div>
      </section>
    }

    @if (aberto()) {
      <app-modal titulo="Gerar Rota Otimizada" (fechar)="!gerando() && aberto.set(false)">
        <form class="space-y-4" (ngSubmit)="gerar()">
          <div><label class="label" for="nome">Nome da rota</label><input id="nome" class="input" name="nome" [(ngModel)]="f.nome" required placeholder="Rota Solar A1" /></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="label" for="hz">Horizonte</label>
              <select id="hz" class="input" name="hz" [(ngModel)]="f.horizonte"><option>Diário</option><option>Semanal</option><option>Mensal</option></select></div>
            <div><label class="label" for="di">Data de início</label><input id="di" class="input" type="date" name="di" [(ngModel)]="f.dataInicio" required /></div>
          </div>
          <p class="text-[11px] leading-relaxed text-gray-400">Diário = 1 dia útil, Semanal = 5, Mensal = 22. Usa todos os clientes, toda a frota e o turno comum dos colaboradores. Respeita capacidade, autonomia do tanque e janelas de atendimento.</p>
          <app-alerta [texto]="erroModal()" />
          <button class="btn-primary w-full justify-center" type="submit" [disabled]="gerando()">{{ gerando() ? 'Calculando rota otimizada…' : 'Gerar rota' }}</button>
        </form>
      </app-modal>
    }`,
})
export class Rotas {
  private api = inject(Api);
  auth = inject(Auth);
  itens = signal<Rota[]>([]);
  detalhe = signal<Rota | null>(null);
  erro = signal(''); erroModal = signal('');
  aberto = signal(false); gerando = signal(false);
  f: { nome: string; horizonte: Horizonte; dataInicio: string } = { nome: '', horizonte: 'Diário', dataInicio: hoje() };
  tempo = h;

  constructor() { this.carregar(); }

  carregar() { this.api.list<Rota>('rotas').subscribe({ next: (r) => this.itens.set(r), error: (e) => this.erro.set(mensagemErro(e)) }); }
  abrir() { this.f = { nome: '', horizonte: 'Diário', dataInicio: hoje() }; this.erroModal.set(''); this.aberto.set(true); }

  ver(id: string) {
    this.api.get<Rota>(`rotas/${id}`).subscribe({ next: (r) => this.detalhe.set(r), error: (e) => this.erro.set(mensagemErro(e)) });
  }

  gerar() {
    this.gerando.set(true); this.erroModal.set('');
    this.api.create<Rota>('rotas', this.f).subscribe({
      next: (r) => { this.aberto.set(false); this.gerando.set(false); this.detalhe.set(r); this.carregar(); },
      error: (e) => { this.erroModal.set(mensagemErro(e)); this.gerando.set(false); },
    });
  }

  remover(r: Rota, ev: Event) {
    ev.stopPropagation();
    if (!confirm(`Remover a rota "${r.nome}"?`)) return;
    this.api.remove('rotas', r.id).subscribe({
      next: () => { if (this.detalhe()?.id === r.id) this.detalhe.set(null); this.carregar(); },
      error: (e) => this.erro.set(mensagemErro(e)),
    });
  }
}
