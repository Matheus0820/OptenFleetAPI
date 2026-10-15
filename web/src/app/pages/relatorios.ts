import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Api, mensagemErro } from '../core/api';
import { RelEmissoes, RelEquipe } from '../core/models';
import { Alerta } from '../shared/ui';

@Component({
  selector: 'app-relatorios',
  imports: [DecimalPipe, KeyValuePipe, Alerta],
  template: `
    <app-alerta [texto]="erro()" />
    <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <button type="button" (click)="aba.set('emissoes')" class="flex items-center justify-between rounded-[32px] p-8 text-left text-white transition-all hover:opacity-90"
              [class]="aba() === 'emissoes' ? 'bg-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900' : 'bg-gray-900 dark:bg-emerald-600'">
        <div><h3 class="mb-1 text-lg font-bold">Relatório de Emissões</h3><p class="text-xs text-gray-400 dark:text-emerald-100">Pegada de carbono e CO₂ evitado por mês.</p></div><span aria-hidden="true">→</span>
      </button>
      <button type="button" (click)="aba.set('equipe')" class="card flex items-center justify-between rounded-[32px] p-8 text-left transition-all hover:border-emerald-200"
              [class]="aba() === 'equipe' ? 'ring-4 ring-emerald-200 dark:ring-emerald-900' : ''">
        <div><h3 class="mb-1 text-lg font-bold text-gray-800 dark:text-white">Relatório de Equipe</h3><p class="text-xs text-gray-400">Detalhamento de horas e produtividade.</p></div><span class="text-emerald-500" aria-hidden="true">→</span>
      </button>
    </div>

    @if (aba() === 'emissoes' && em(); as e) {
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="card p-6"><p class="label">CO₂ emitido (total)</p><p class="text-3xl font-black dark:text-white">{{ e.totais.co2Kg | number: '1.0-1' }} kg</p></div>
        <div class="rounded-3xl bg-emerald-500 p-6 text-white"><p class="text-[10px] font-black uppercase tracking-widest opacity-80">CO₂ evitado (total)</p><p class="text-3xl font-black">{{ e.totais.reducaoCo2Kg | number: '1.0-1' }} kg</p></div>
        <div class="card p-6"><p class="label">Distância (total)</p><p class="text-3xl font-black dark:text-white">{{ e.totais.distanciaKm | number: '1.0-1' }} km</p></div>
      </div>
      <div class="card overflow-x-auto">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead class="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:bg-gray-800"><tr><th class="th">Mês</th><th class="th">Rotas</th><th class="th">Distância</th><th class="th">Combustível</th><th class="th">CO₂</th><th class="th">Evitado</th></tr></thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
            @for (m of e.meses; track m.periodo) {
              <tr><td class="px-6 py-4 font-bold dark:text-white">{{ m.periodo }}</td><td class="px-6 py-4">{{ m.rotas }}</td><td class="px-6 py-4">{{ m.distanciaKm | number: '1.0-1' }} km</td>
                <td class="px-6 py-4">{{ m.litros | number: '1.0-1' }} L</td><td class="px-6 py-4 font-black text-emerald-600 dark:text-emerald-400">{{ m.co2Kg | number: '1.0-1' }} kg</td><td class="px-6 py-4">{{ m.reducaoCo2Kg | number: '1.0-1' }} kg</td></tr>
            } @empty { <tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">Sem rotas geradas.</td></tr> }
          </tbody>
        </table>
      </div>
    }

    @if (aba() === 'equipe' && eq(); as q) {
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="card p-6"><p class="label">Colaboradores</p><p class="text-3xl font-black dark:text-white">{{ q.colaboradores }}</p></div>
        <div class="card p-6"><p class="label">Horas semanais contratadas</p><p class="text-3xl font-black dark:text-white">{{ q.horasSemanaisContratadas }} h</p></div>
        <div class="rounded-3xl bg-emerald-500 p-6 text-white"><p class="text-[10px] font-black uppercase tracking-widest opacity-80">Horas em rota no mês</p><p class="text-3xl font-black">{{ q.horasEmRotaNoMes | number: '1.0-1' }} h</p></div>
      </div>
      <div class="card overflow-x-auto">
        <table class="w-full min-w-[560px] text-left text-sm">
          <thead class="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:bg-gray-800"><tr><th class="th">Colaborador</th><th class="th">Função</th><th class="th">Jornada</th><th class="th">Carga semanal</th></tr></thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
            @for (d of q.detalhe; track d.nome + d.jornada) {
              <tr><td class="px-6 py-4 font-bold dark:text-white">{{ d.nome }}</td><td class="px-6 py-4"><span class="badge">{{ d.funcao }}</span></td><td class="px-6 py-4">{{ d.jornada }}</td><td class="px-6 py-4">{{ d.cargaSemanalHoras }} h</td></tr>
            } @empty { <tr><td colspan="4" class="px-6 py-8 text-center text-gray-400">Sem colaboradores.</td></tr> }
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-[11px] text-gray-400">Por função: @for (f of q.porFuncao | keyvalue; track f.key) { {{ f.key }} ({{ f.value.colaboradores }}) · }</p>
    }`,
})
export class Relatorios {
  private api = inject(Api);
  aba = signal<'emissoes' | 'equipe'>('emissoes');
  em = signal<RelEmissoes | null>(null);
  eq = signal<RelEquipe | null>(null);
  erro = signal('');

  constructor() {
    const falha = (e: unknown) => this.erro.set(mensagemErro(e));
    this.api.get<RelEmissoes>('relatorios/emissoes').subscribe({ next: (r) => this.em.set(r), error: falha });
    this.api.get<RelEquipe>('relatorios/equipe').subscribe({ next: (r) => this.eq.set(r), error: falha });
  }
}
