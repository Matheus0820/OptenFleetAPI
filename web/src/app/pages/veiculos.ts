import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, mensagemErro } from '../core/api';
import { Veiculo } from '../core/models';
import { Alerta, Modal } from '../shared/ui';

const vazio = () => ({ marca: '', modelo: '', categoria: 'Insumos', anoFabricacao: new Date().getFullYear(), placa: '', capacidadeCarga: 1, capacidadeMaximaTanque: 60, quilometroPorLitro: 10 });

@Component({
  selector: 'app-veiculos',
  imports: [FormsModule, DecimalPipe, Alerta, Modal],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white">Frota Operacional</h2>
      <button class="btn-primary" type="button" (click)="abrir()">+ Cadastrar Veículo</button>
    </div>
    <app-alerta [texto]="erro()" />
    <div class="card mt-4 overflow-x-auto">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:bg-gray-800">
          <tr><th class="th">Veículo</th><th class="th">Categoria</th><th class="th">Capacidade</th><th class="th">Autonomia</th><th class="th text-emerald-600 dark:text-emerald-400">Emissão CO₂/km</th><th class="th text-center">Ações</th></tr>
        </thead>
        <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
          @for (v of itens(); track v.id) {
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 font-bold dark:text-white">{{ v.marca }} {{ v.modelo }}<span class="block text-[10px] font-normal text-gray-400">{{ v.placa }} · {{ v.anoFabricacao }}</span></td>
              <td class="px-6 py-4 italic text-gray-500 dark:text-gray-400">{{ v.categoria }}</td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ v.capacidadeCarga }} {{ v.categoria === 'Pessoas' ? 'pessoas' : 'itens' }}</td>
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ v.autonomiaKm | number: '1.0-0' }} km</td>
              <td class="px-6 py-4 font-black text-emerald-600 dark:text-emerald-400">{{ v.emissaoCo2KgPorKm | number: '1.2-3' }} kg</td>
              <td class="px-6 py-4 text-center"><button class="p-2 text-red-300 hover:text-red-500" type="button" [attr.aria-label]="'Remover ' + v.placa" (click)="remover(v)"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></svg></button></td>
            </tr>
          } @empty { <tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">Nenhum veículo cadastrado.</td></tr> }
        </tbody>
      </table>
    </div>

    @if (aberto()) {
      <app-modal titulo="Cadastrar Veículo" (fechar)="aberto.set(false)">
        <form class="grid grid-cols-2 gap-4" (ngSubmit)="salvar()">
          <div><label class="label" for="marca">Marca</label><input id="marca" class="input" name="marca" [(ngModel)]="f.marca" required /></div>
          <div><label class="label" for="modelo">Modelo</label><input id="modelo" class="input" name="modelo" [(ngModel)]="f.modelo" required /></div>
          <div><label class="label" for="placa">Placa</label><input id="placa" class="input uppercase" name="placa" [(ngModel)]="f.placa" required placeholder="ABC1D23" /></div>
          <div><label class="label" for="ano">Ano</label><input id="ano" class="input" type="number" name="ano" [(ngModel)]="f.anoFabricacao" required /></div>
          <div><label class="label" for="cat">Categoria</label>
            <select id="cat" class="input" name="cat" [(ngModel)]="f.categoria"><option>Insumos</option><option>Pessoas</option></select></div>
          <div><label class="label" for="cap">Capacidade ({{ f.categoria === 'Pessoas' ? 'pessoas' : 'itens' }})</label><input id="cap" class="input" type="number" min="1" name="cap" [(ngModel)]="f.capacidadeCarga" required /></div>
          <div><label class="label" for="tanque">Tanque (L)</label><input id="tanque" class="input" type="number" min="1" name="tanque" [(ngModel)]="f.capacidadeMaximaTanque" required /></div>
          <div><label class="label" for="kml">Consumo (km/L)</label><input id="kml" class="input" type="number" min="0.1" step="0.1" name="kml" [(ngModel)]="f.quilometroPorLitro" required /></div>
          <div class="col-span-2 space-y-3">
            <app-alerta [texto]="erroModal()" />
            <button class="btn-primary w-full justify-center" type="submit" [disabled]="salvando()">{{ salvando() ? 'Salvando…' : 'Salvar veículo' }}</button>
          </div>
        </form>
      </app-modal>
    }`,
})
export class Veiculos {
  private api = inject(Api);
  itens = signal<Veiculo[]>([]);
  erro = signal(''); erroModal = signal('');
  aberto = signal(false); salvando = signal(false);
  f: any = vazio();

  constructor() { this.carregar(); }

  carregar() { this.api.list<Veiculo>('frota').subscribe({ next: (r) => this.itens.set(r), error: (e) => this.erro.set(mensagemErro(e)) }); }
  abrir() { this.f = vazio(); this.erroModal.set(''); this.aberto.set(true); }

  salvar() {
    this.salvando.set(true); this.erroModal.set('');
    this.api.create('frota', this.f).subscribe({
      next: () => { this.aberto.set(false); this.salvando.set(false); this.carregar(); },
      error: (e) => { this.erroModal.set(mensagemErro(e)); this.salvando.set(false); },
    });
  }

  remover(v: Veiculo) {
    if (!confirm(`Remover o veículo ${v.placa}?`)) return;
    this.api.remove('frota', v.id).subscribe({ next: () => this.carregar(), error: (e) => this.erro.set(mensagemErro(e)) });
  }
}
