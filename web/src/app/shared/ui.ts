import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="fechar.emit()">
      <div class="animate-fadeIn max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl dark:bg-gray-900"
           role="dialog" aria-modal="true" [attr.aria-label]="titulo()" (click)="$event.stopPropagation()">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ titulo() }}</h3>
          <button type="button" class="text-gray-400 hover:text-gray-600" aria-label="Fechar" (click)="fechar.emit()">✕</button>
        </div>
        <ng-content />
      </div>
    </div>`,
})
export class Modal {
  titulo = input.required<string>();
  fechar = output<void>();
}

@Component({
  selector: 'app-alerta',
  template: `@if (texto()) {
    <p class="rounded-xl px-4 py-3 text-xs font-semibold"
       [class]="tipo() === 'erro' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">{{ texto() }}</p>
  }`,
})
export class Alerta {
  texto = input<string | null>('');
  tipo = input<'erro' | 'aviso'>('erro');
}
