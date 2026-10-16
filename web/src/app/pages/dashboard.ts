import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Api, mensagemErro } from '../core/api';
import { Dashboard as Dados } from '../core/models';
import { Alerta } from '../shared/ui';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, Alerta],
  template: `
    <app-alerta [texto]="erro()" />
    @if (d(); as d) {
      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="card p-6"><h4 class="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Rotas</h4><p class="text-4xl font-black dark:text-white">{{ d.rotas }}</p></div>
          <div class="card p-6"><h4 class="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Colaboradores</h4><p class="text-4xl font-black dark:text-white">{{ d.colaboradores }}</p></div>
          <div class="card p-6"><h4 class="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Clientes</h4><p class="text-4xl font-black dark:text-white">{{ d.clientes }}</p></div>
          <div class="rounded-3xl bg-emerald-500 p-6 text-white shadow-xl shadow-emerald-100 dark:shadow-none">
            <h4 class="mb-1 text-[10px] font-black uppercase tracking-widest opacity-80">Frota Ativa</h4><p class="text-4xl font-black">{{ d.frota }}</p>
          </div>
        </div>
        <div class="rounded-[32px] border border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
          <h3 class="font-bold text-gray-800 dark:text-white">Redução Mensal CO₂</h3>
          <p class="mt-2 text-5xl font-black text-emerald-500">{{ d.reducaoMensalCo2Kg | number: '1.0-1' }} kg</p>
          <p class="mt-2 text-xs text-gray-400">Economia frente a atender cada cliente em viagem individual · emissão planejada no mês: {{ d.emissaoMensalCo2Kg | number: '1.0-1' }} kg</p>
        </div>
      </div>
    } @else if (!erro()) {
      <p class="text-sm text-gray-400">Carregando…</p>
    }`,
})
export class Dashboard {
  d = signal<Dados | null>(null);
  erro = signal('');
  constructor() {
    inject(Api).get<Dados>('dashboard').subscribe({ next: (r) => this.d.set(r), error: (e) => this.erro.set(mensagemErro(e)) });
  }
}
