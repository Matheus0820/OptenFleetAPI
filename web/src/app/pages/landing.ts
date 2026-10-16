import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  template: `
    <main class="landing min-h-screen overflow-hidden text-slate-900">
      <header class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a routerLink="/" class="flex items-center gap-3" aria-label="Opt.en Fleet — início">
          <img src="logo.png" alt="Opt.en Fleet" class="h-11 w-11 object-contain rounded-[11px]" />
          <span class="text-lg font-bold tracking-tight">Opt.en <span class="font-medium text-slate-500">Fleet</span></span>
        </a>
        <nav aria-label="Navegação principal" class="flex items-center gap-3 sm:gap-7">
          <a class="hidden text-sm font-medium text-slate-600 transition hover:text-emerald-700 sm:inline" href="#produto">O produto</a>
          <a routerLink="/login" class="nav-cta">Acessar plataforma</a>
        </nav>
      </header>

      <section class="hero mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:pb-28 lg:pt-16">
        <div class="hero-copy">
          <p class="hero-kicker"><span></span> Gestão de frota e rotas</p>
          <h1>Rotas mais claras.<br><em>Operações no controle.</em></h1>
          <p class="hero-description">Organize veículos, equipes, clientes e rotas em um só lugar. Tenha uma visão prática da operação para planejar cada dia com mais confiança.</p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <a routerLink="/login" class="primary-cta">Conheça a plataforma <span aria-hidden="true">↗</span></a>
            <a href="#produto" class="text-sm font-semibold text-slate-600 transition hover:text-emerald-700">Veja como funciona</a>
          </div>
          <p class="mt-5 text-xs text-slate-500">Acesso para equipes e gestores da operação.</p>
        </div>

        <div class="visual-wrap" aria-label="Ilustração de uma rota planejada em um mapa" role="img">
          <div class="map-grid" aria-hidden="true"></div>
          <svg class="route-map" viewBox="0 0 640 440" fill="none" aria-hidden="true">
            <path class="road road-wide" d="M-20 87C90 132 119 53 212 91s123 119 217 62 122-87 238-44M-8 320c91-18 137-116 230-81s132 82 228 41 114-92 211-74M110-15c-7 100 69 138 39 220s-4 136 53 251M442-12c-37 85-10 139 50 185s42 111 10 174 13 86 46 113" stroke="#DCE9E3" stroke-width="18" stroke-linecap="round"/>
            <path class="road" d="M-20 87C90 132 119 53 212 91s123 119 217 62 122-87 238-44M-8 320c91-18 137-116 230-81s132 82 228 41 114-92 211-74M110-15c-7 100 69 138 39 220s-4 136 53 251M442-12c-37 85-10 139 50 185s42 111 10 174 13 86 46 113" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <path class="route-line" d="M126 286C169 260 188 168 252 181s63 93 119 76 64-83 123-54" stroke="#15966A" stroke-width="5" stroke-linecap="round" stroke-dasharray="8 10"/>
            <circle cx="126" cy="286" r="10" fill="#fff" stroke="#15966A" stroke-width="5"/><circle cx="494" cy="203" r="13" fill="#15966A" stroke="#fff" stroke-width="5"/>
            <circle cx="252" cy="181" r="6" fill="#fff" stroke="#15966A" stroke-width="3"/><circle cx="371" cy="257" r="6" fill="#fff" stroke="#15966A" stroke-width="3"/>
          </svg>
          <div class="route-card route-card-top"><span class="route-icon">↗</span><span><b>Rota do dia</b><small>Paradas organizadas</small></span><span class="route-status">Planejada</span></div>
          <div class="route-card route-card-bottom"><span class="truck-icon" aria-hidden="true">▰</span><span><b>Operação em foco</b><small>Rotas, equipe e frota</small></span><span class="live-dot" aria-label="Visão operacional"></span></div>
          <div class="map-caption">Planejamento que conecta cada etapa</div>
        </div>
      </section>

      <section id="produto" class="product-section px-6 py-20 lg:px-10 lg:py-28">
        <div class="mx-auto max-w-7xl">
          <div class="section-heading"><p class="section-label">Uma visão integrada</p><h2>Do planejamento à rua,<br>tudo conversa.</h2><p>Reúna as informações essenciais para acompanhar a operação sem espalhar o trabalho por várias ferramentas.</p></div>
          <div class="feature-grid mt-14">
            <article class="feature feature-large">
              <div class="feature-visual fleet-visual">
                <div class="fleet-route" aria-hidden="true"></div>
                <div class="fleet-pin pin-one" aria-hidden="true"></div>
                <div class="fleet-pin pin-two" aria-hidden="true"></div>
                <div class="fleet-pin pin-three" aria-hidden="true"></div>
                <div class="fleet-label">Rotas Otimizadas</div>
              </div>
              <div class="feature-copy">
                <span class="feature-number">01</span>
                <h3>Planeje rotas com contexto</h3>
                <p>Organize paradas e acompanhe distâncias, atendimentos e estimativas da operação em um só fluxo.</p>
              </div>
            </article>
            <article class="feature"><div class="feature-visual records-visual"><div class="record-row"><span class="record-icon green">▰</span><span><b>Veículos</b><small>Frota cadastrada</small></span><span class="record-check">✓</span></div><div class="record-row"><span class="record-icon blue">⌖</span><span><b>Clientes</b><small>Pontos de atendimento</small></span><span class="record-check">✓</span></div><div class="record-row"><span class="record-icon amber">◎</span><span><b>Colaboradores</b><small>Equipe da operação</small></span><span class="record-check">✓</span></div></div><div class="feature-copy"><span class="feature-number">02</span><h3>Centralize sua operação</h3><p>Tenha veículos, clientes e colaboradores organizados em uma plataforma única.</p></div></article>
            <article class="feature"><div class="feature-visual report-visual"><div class="report-head"><span>Resumo da operação</span><span class="report-period">Mensal</span></div><div class="report-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="report-legend"><span></span> Indicadores e relatórios</div></div><div class="feature-copy"><span class="feature-number">03</span><h3>Acompanhe os indicadores</h3><p>Consulte dados de rotas e relatórios para compreender o ritmo e os resultados planejados.</p></div></article>
          </div>
        </div>
      </section>

      <section class="closing-section px-6 py-20 lg:px-10 lg:py-28"><div class="closing-inner mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p class="section-label">Sua operação, mais conectada</p><h2>Leve mais clareza<br>para cada rota.</h2></div><a routerLink="/login" class="closing-cta">Acessar a Opt.en Fleet <span aria-hidden="true">↗</span></a></div></section>

      <footer class="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>© 2026 Opt.en Fleet</span><a href="https://optensolutions.vercel.app/" target="_blank" rel="noopener noreferrer" class="transition hover:text-emerald-700">Opten Solutions</a></footer>
    </main>
  `,
  styles: `
    :host{display:block}.landing{background:#f7faf8}.brand-mark{width:36px;height:36px;display:grid;place-items:center;background:#e9f6ee;color:#087e59;border-radius:11px}.brand-mark svg{width:22px;height:22px}.nav-cta{padding:11px 17px;border:1px solid #dce9e2;border-radius:7px;background:#fff;color:#087e59;font-size:13px;font-weight:700;transition:background .2s,border-color .2s}.nav-cta:hover{background:#eff8f3;border-color:#aad5be}.hero-copy{position:relative;z-index:1;animation:copy-arrive .7s ease-out both}.hero-kicker,.section-label{display:flex;align-items:center;gap:9px;color:#087e59;font-size:13px;font-weight:700}.hero-kicker span{width:8px;height:8px;border-radius:50%;background:#21a477;box-shadow:0 0 0 4px #dff1e8}.hero h1{margin:22px 0 0;font-size:clamp(2.8rem,5.3vw,5.2rem);font-weight:700;line-height:1.02;letter-spacing:-.065em}.hero h1 em{color:#16825d;font-style:normal}.hero-description{max-width:510px;margin-top:22px;color:#5e6c65;font-size:17px;line-height:1.75}.primary-cta,.closing-cta{display:inline-flex;align-items:center;gap:22px;padding:15px 19px;border-radius:7px;background:#087e59;color:#fff;font-size:14px;font-weight:700;box-shadow:0 10px 24px #087e5925;transition:transform .2s,background .2s}.primary-cta:hover,.closing-cta:hover{transform:translateY(-2px);background:#066d4c}.visual-wrap{position:relative;min-height:460px;border:1px solid #e4eee8;border-radius:20px;background:#edf5f0;overflow:hidden;box-shadow:0 24px 70px #20443413;animation:visual-arrive .9s .08s ease-out both}.map-grid{position:absolute;inset:0;background-image:linear-gradient(#fff8 1px,transparent 1px),linear-gradient(90deg,#fff8 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to bottom right,#000,transparent 90%)}.route-map{position:absolute;width:100%;height:100%;inset:0}.route-line{animation:route-draw 1.8s .4s ease-out both}.route-card{position:absolute;z-index:2;display:flex;align-items:center;gap:11px;padding:14px 16px;border:1px solid #e7eee9;border-radius:10px;background:#fff;box-shadow:0 12px 30px #31534212}.route-card b,.record-row b{display:block;color:#24352c;font-size:12px}.route-card small,.record-row small{display:block;margin-top:3px;color:#839087;font-size:10px}.route-card-top{top:12%;left:7%}.route-card-bottom{right:5%;bottom:14%}.route-icon{display:grid;width:32px;height:32px;place-items:center;border-radius:8px;background:#e8f6ee;color:#16825d;font-size:19px}.route-status{margin-left:16px;padding:5px 8px;border-radius:20px;background:#eff8f2;color:#16825d;font-size:9px;font-weight:700}.truck-icon{display:grid;width:35px;height:35px;place-items:center;border-radius:9px;background:#f0f4f1;color:#4c6457}.live-dot{width:8px;height:8px;margin-left:18px;border-radius:50%;background:#3eb883;box-shadow:0 0 0 4px #e4f5eb}.map-caption{position:absolute;bottom:18px;left:22px;color:#718078;font-size:11px}.product-section{background:#fff}.section-heading{max-width:650px}.section-label{margin:0 0 15px}.section-heading h2,.closing-inner h2{margin:0;font-size:clamp(2.1rem,4vw,3.5rem);font-weight:700;line-height:1.08;letter-spacing:-.055em;color:#1d3027}.section-heading>p:last-child{max-width:530px;margin-top:17px;color:#6f7c75;font-size:15px;line-height:1.75}.feature-grid{display:grid;grid-template-columns:1.2fr .9fr .9fr;gap:22px}.feature{overflow:hidden;border:1px solid #e8eee9;border-radius:13px;background:#fff}.feature-visual{position:relative;height:210px;overflow:hidden;background:#f0f6f2}.feature-large .feature-visual{height:210px}.feature-copy{padding:22px 23px 25px}.feature-number{color:#16825d;font-size:11px;font-weight:700}.feature-copy h3{margin:12px 0 8px;color:#26382f;font-size:18px;font-weight:700;letter-spacing:-.025em}.feature-copy p{margin:0;color:#748078;font-size:13px;line-height:1.7}.fleet-visual{background-color:#edf5ef;background-image:linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px);background-size:34px 34px}
.fleet-route{position:absolute;left:10%;top:20%;width:80%;height:60%;border:3px dashed #3ba477;border-radius:50%;opacity:0.4}
.fleet-pin{position:absolute;width:14px;height:14px;border:3px solid #fff;border-radius:50%;background:#087e59;box-shadow:0 3px 10px rgba(8,126,89,0.3)}
.pin-one{left:22%;top:58%}
.pin-two{left:52%;top:32%}
.pin-three{right:22%;top:54%}
.fleet-label{position:absolute;bottom:16px;right:18px;padding:8px 12px;border:1px solid #d8e8e0;border-radius:8px;background:#fff;color:#087e59;font-size:11px;font-weight:600;box-shadow:0 4px 12px rgba(8,126,89,0.08)}.records-visual{display:flex;flex-direction:column;justify-content:center;gap:9px;padding:18px 22px;background:#f4f7f5}.record-row{display:flex;align-items:center;gap:10px;padding:10px 11px;border:1px solid #e9efeb;border-radius:7px;background:#fff}.record-row>span:nth-child(2){flex:1}.record-icon{display:grid;width:27px;height:27px;place-items:center;border-radius:6px;font-size:13px}.record-icon.green{background:#e9f6ee;color:#16825d}.record-icon.blue{background:#eef3fa;color:#6482ae}.record-icon.amber{background:#fbf3e6;color:#ba8e41}.record-check{color:#55a57e;font-size:13px}.report-visual{padding:21px 22px;background:#f4f7f5}.report-head{display:flex;justify-content:space-between;color:#44564b;font-size:10px;font-weight:700}.report-period{color:#87938c;font-weight:500}.report-bars{display:flex;height:105px;align-items:end;justify-content:space-between;gap:8px;padding:12px 7px 0;border-bottom:1px solid #dfe8e2}.report-bars i{width:9%;border-radius:4px 4px 0 0;background:#75bd98}.report-bars i:nth-child(1){height:34%}.report-bars i:nth-child(2){height:52%}.report-bars i:nth-child(3){height:43%}.report-bars i:nth-child(4){height:71%}.report-bars i:nth-child(5){height:59%}.report-bars i:nth-child(6){height:84%}.report-bars i:nth-child(7){height:67%}.report-bars i:nth-child(8){height:96%;background:#16825d}.report-legend{display:flex;align-items:center;gap:6px;margin-top:12px;color:#849088;font-size:9px}.report-legend span{width:7px;height:7px;border-radius:50%;background:#16825d}.closing-section{background:#edf5f0}.closing-cta{white-space:nowrap}.closing-inner h2{font-size:clamp(2.2rem,4vw,3.5rem)}
    @keyframes copy-arrive{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes visual-arrive{from{opacity:0;transform:translateY(12px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes route-draw{from{stroke-dashoffset:180;opacity:.3}to{stroke-dashoffset:0;opacity:1}}
    @media(max-width:900px){.feature-grid{grid-template-columns:1fr 1fr}.feature-large{grid-column:span 2}.visual-wrap{min-height:400px}.hero{padding-top:40px}}
    @media(max-width:600px){.visual-wrap{min-height:310px;border-radius:14px}.route-card{gap:8px;padding:10px}.route-card-top{left:4%;top:9%}.route-card-bottom{right:4%;bottom:12%}.route-status{margin-left:2px}.feature-grid{grid-template-columns:1fr;gap:15px}.feature-large{grid-column:auto}.feature-visual,.feature-large .feature-visual{height:190px}.hero-description{font-size:15px}.hero{gap:34px}.closing-inner{align-items:flex-start}.closing-cta{padding:13px 15px}.brand-mark{width:32px;height:32px}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
    :host a:focus-visible{outline:3px solid #087e59;outline-offset:4px;border-radius:4px}
  `,
})
export class Landing {}
