window.__ModuleLoader__.load({
  id: '@tobewin/dsh-pet-companion',
  factory: (require) => {
    const React = require('react');
    const { jsx, jsxs } = require('react/jsx-runtime');
    const { Button } = require('@deepseek-ai/dsh-client-ui-primitives');

    const NS = 'settings.tobewinPetCompanion';
    const storageKey = '@tobewin/dsh-pet-companion/settings/v1';
    const inject = ['slots', 'locale'];
    const pets = [
      { id: 'beaver', emoji: '🦫', key: 'beaver' },
      { id: 'cat', emoji: '🐱', key: 'cat' },
      { id: 'axolotl', emoji: '🦎', key: 'axolotl' },
      { id: 'shiba', emoji: '🐕', key: 'shiba' },
    ];
    const defaults = Object.freeze({ enabled: true, pet: 'beaver', size: 'normal', side: 'right', animated: true });

    const zh = {
      title: '萌宠伴侣',
      subtitle: '在工作区边缘放置一只轻盈、可关闭的动态小伙伴。所有偏好仅保存在本地。',
      enabled: '萌宠已显示',
      disabled: '萌宠已隐藏',
      show: '显示萌宠',
      hide: '隐藏萌宠',
      template: '选择萌宠',
      size: '大小',
      side: '停靠位置',
      motion: '动态效果',
      motionOn: '播放动画',
      motionOff: '暂停动画',
      small: '小',
      normal: '标准',
      large: '大',
      left: '左侧',
      right: '右侧',
      beaver: '团团海狸',
      'beaver.detail': '敲一敲、眨眨眼的专注小搭档',
      cat: '云朵猫',
      'cat.detail': '轻摆尾巴、安静陪伴的云端猫咪',
      axolotl: '桃子六角',
      'axolotl.detail': '会冒泡的粉色水精灵',
      shiba: '丸子柴',
      'shiba.detail': '摇摇耳朵、给你打气的小柴犬',
      quickHide: '暂时隐藏萌宠',
      quickShow: '显示萌宠伴侣',
      petLabel: '萌宠伴侣',
    };

    const en = {
      title: 'Pet Companion',
      subtitle: 'Place a light, dismissible animated companion at the edge of your workspace. All preferences stay local.',
      enabled: 'Pet is visible',
      disabled: 'Pet is hidden',
      show: 'Show pet',
      hide: 'Hide pet',
      template: 'Choose a pet',
      size: 'Size',
      side: 'Dock',
      motion: 'Motion',
      motionOn: 'Play animation',
      motionOff: 'Pause animation',
      small: 'Small',
      normal: 'Normal',
      large: 'Large',
      left: 'Left',
      right: 'Right',
      beaver: 'Momo Beaver',
      'beaver.detail': 'A focused companion who taps and blinks',
      cat: 'Cloud Cat',
      'cat.detail': 'A quiet cloud cat with a gentle tail swish',
      axolotl: 'Peach Axolotl',
      'axolotl.detail': 'A rosy water sprite that sends tiny bubbles',
      shiba: 'Dango Shiba',
      'shiba.detail': 'An encouraging shiba with wiggly ears',
      quickHide: 'Hide pet for now',
      quickShow: 'Show Pet Companion',
      petLabel: 'Pet Companion',
    };

    function normalize(value) {
      const candidate = value && typeof value === 'object' ? value : {};
      return {
        enabled: candidate.enabled !== false,
        pet: pets.some((pet) => pet.id === candidate.pet) ? candidate.pet : defaults.pet,
        size: ['small', 'normal', 'large'].includes(candidate.size) ? candidate.size : defaults.size,
        side: candidate.side === 'left' ? 'left' : 'right',
        animated: candidate.animated !== false,
      };
    }

    function createStore() {
      let snapshot = defaults;
      try { snapshot = normalize(JSON.parse(window.localStorage.getItem(storageKey) || '{}')); } catch { snapshot = defaults; }
      const listeners = new Set();
      return {
        getSnapshot: () => snapshot,
        subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
        set: (next) => {
          snapshot = normalize({ ...snapshot, ...next });
          try { window.localStorage.setItem(storageKey, JSON.stringify(snapshot)); } catch { /* persistence is optional */ }
          listeners.forEach((listener) => listener());
        },
      };
    }

    function petSvg(id) {
      if (id === 'cat') return `<svg viewBox="0 0 160 160" aria-hidden="true"><g class="pet-bob"><path class="pet-shadow" d="M28 134c13-11 91-11 104 0-11 14-94 14-104 0Z"/><path class="pet-tail" d="M119 102c26-10 27 29 1 26"/><path class="pet-body cat-body" d="M43 84c0-28 75-29 78 2l3 34c-15 19-71 20-86 0Z"/><path class="pet-head cat-head" d="M38 62 41 25l24 18c11-5 23-5 34 0l23-18 2 37c10 34-74 39-66 0Z"/><path class="pet-ear" d="m46 47 2-13 12 12M106 46l12-12 1 14"/><g class="pet-eyes"><path d="M57 66c4-7 10-7 14 0M89 66c4-7 10-7 14 0"/></g><path class="pet-mouth" d="M73 79c5 4 10 4 15 0m-7-2v7"/><path class="pet-belly" d="M62 108c13 7 27 7 40 0"/></g></svg>`;
      if (id === 'axolotl') return `<svg viewBox="0 0 160 160" aria-hidden="true"><g class="pet-bob"><path class="pet-shadow" d="M33 135c11-12 81-12 93 0-14 13-81 14-93 0Z"/><g class="pet-bubbles"><circle cx="124" cy="40" r="5"/><circle cx="137" cy="62" r="3"/><circle cx="120" cy="24" r="2"/></g><path class="pet-tail" d="M107 107c23 18 38-3 15-16"/><path class="pet-body axolotl-body" d="M42 82c5-32 68-39 82 4l-5 36c-16 18-61 18-78 0Z"/><path class="pet-gills" d="M48 64 25 45m25 29L23 72m91-8 23-19m-23 29 27-2"/><path class="pet-head axolotl-head" d="M39 70c-2-35 82-35 82 0 0 38-82 38-82 0Z"/><g class="pet-eyes"><circle cx="66" cy="67" r="4"/><circle cx="97" cy="67" r="4"/></g><path class="pet-mouth" d="M70 82c8 7 15 7 23 0"/><path class="pet-belly" d="M62 105c13 7 27 7 40 0"/></g></svg>`;
      if (id === 'shiba') return `<svg viewBox="0 0 160 160" aria-hidden="true"><g class="pet-bob"><path class="pet-shadow" d="M28 136c15-13 90-13 105 0-12 14-94 14-105 0Z"/><path class="pet-tail" d="M119 103c26-20 23 24 3 22"/><path class="pet-body shiba-body" d="M40 83c11-27 68-27 81 2l3 36c-16 18-69 18-85 0Z"/><path class="pet-head shiba-head" d="M37 65 42 24l25 20c9-4 19-4 28 0l24-20 4 41c4 39-89 39-86 0Z"/><path class="pet-ear" d="m47 49 1-15 13 14m50 0 13-14 1 15"/><path class="pet-muzzle" d="M57 75c8-9 39-9 48 0l-3 22c-11 12-31 12-42 0Z"/><g class="pet-eyes"><circle cx="63" cy="67" r="4"/><circle cx="98" cy="67" r="4"/></g><path class="pet-nose" d="M76 78c4-4 9-4 13 0-4 6-9 6-13 0Z"/><path class="pet-mouth" d="M82 83v7m-11 0c7 8 15 8 22 0"/></g></svg>`;
      return `<svg viewBox="0 0 160 160" aria-hidden="true"><g class="pet-bob"><path class="pet-shadow" d="M28 136c13-14 91-14 104 0-13 14-92 14-104 0Z"/><path class="pet-body beaver-body" d="M43 82c7-28 67-28 76 1l4 38c-16 19-66 19-83 0Z"/><path class="pet-head beaver-head" d="M36 65c0-37 88-37 88 0 0 40-88 40-88 0Z"/><path class="pet-ear" d="M48 46c-14-16 10-29 21-8m43 8c14-16-10-29-21-8"/><g class="pet-eyes"><circle cx="64" cy="65" r="4"/><circle cx="97" cy="65" r="4"/></g><path class="pet-nose" d="M75 75c4-4 9-4 13 0-4 5-9 5-13 0Z"/><path class="pet-mouth" d="M81 80v7m-12 0c8 9 17 9 25 0"/><path class="pet-teeth" d="M73 88h17v14H73z"/><path class="pet-belly" d="M61 110c14 8 29 8 41 0"/><path class="pet-paw" d="M55 112v16m50-16v16"/></g></svg>`;
    }

    function installStyles() {
      if (document.getElementById('tobewin-pet-companion-style')) return;
      const style = document.createElement('style');
      style.id = 'tobewin-pet-companion-style';
      style.textContent = `
        .tobewin-pet-layer { position: fixed !important; z-index: 80 !important; bottom: 18px !important; pointer-events: none; }
        .tobewin-pet-layer[data-side="right"] { right: 20px; } .tobewin-pet-layer[data-side="left"] { left: 20px; }
        .tobewin-pet-dock { position: relative; display: flex; width: var(--pet-size); height: var(--pet-size); align-items: flex-end; justify-content: center; pointer-events: auto; filter: drop-shadow(0 10px 16px rgba(9, 18, 34, .22)); }
        .tobewin-pet-layer[data-size="small"] { --pet-size: 82px; } .tobewin-pet-layer[data-size="normal"] { --pet-size: 118px; } .tobewin-pet-layer[data-size="large"] { --pet-size: 154px; }
        .tobewin-pet-sprite { width: 100%; height: 100%; overflow: visible; animation: tobewin-pet-float 3.1s ease-in-out infinite; transform-origin: center bottom; }
        .tobewin-pet-layer[data-animated="false"] .tobewin-pet-sprite, .tobewin-pet-layer[data-animated="false"] .pet-bob, .tobewin-pet-layer[data-animated="false"] .pet-tail, .tobewin-pet-layer[data-animated="false"] .pet-ear, .tobewin-pet-layer[data-animated="false"] .pet-bubbles { animation-play-state: paused; }
        .tobewin-pet-sprite .pet-shadow { fill: color-mix(in srgb, var(--dsw-alias-bg-base) 46%, transparent); } .tobewin-pet-sprite .pet-head { stroke: color-mix(in srgb, var(--dsw-alias-label-primary) 24%, transparent); stroke-width: 3; stroke-linejoin: round; }
        .tobewin-pet-sprite .pet-body { stroke: color-mix(in srgb, var(--dsw-alias-label-primary) 21%, transparent); stroke-width: 3; stroke-linejoin: round; }
        .tobewin-pet-sprite .beaver-head { fill: #b9754e; } .tobewin-pet-sprite .beaver-body { fill: #d89a65; } .tobewin-pet-sprite .cat-head { fill: #b9a6f2; } .tobewin-pet-sprite .cat-body { fill: #d8ccff; } .tobewin-pet-sprite .axolotl-head { fill: #ff9eba; } .tobewin-pet-sprite .axolotl-body { fill: #ffc0d1; } .tobewin-pet-sprite .shiba-head { fill: #e99851; } .tobewin-pet-sprite .shiba-body { fill: #f4ba76; }
        .tobewin-pet-sprite .pet-ear { fill: none; stroke: #6c3c34; stroke-width: 5; stroke-linecap: round; transform-box: fill-box; transform-origin: center; animation: tobewin-pet-ear 2.8s ease-in-out infinite; } .tobewin-pet-sprite .pet-eyes { fill: #232230; stroke: #232230; stroke-width: 3; stroke-linecap: round; animation: tobewin-pet-blink 4.8s ease-in-out infinite; transform-origin: center; } .tobewin-pet-sprite .pet-mouth { fill: none; stroke: #633a38; stroke-width: 3; stroke-linecap: round; } .tobewin-pet-sprite .pet-nose { fill: #49313b; } .tobewin-pet-sprite .pet-teeth { fill: #fffaf0; stroke: #a96445; stroke-width: 2; } .tobewin-pet-sprite .pet-belly { fill: none; stroke: rgba(255,255,255,.54); stroke-width: 3; stroke-linecap: round; } .tobewin-pet-sprite .pet-paw { fill: none; stroke: #8e533e; stroke-width: 5; stroke-linecap: round; } .tobewin-pet-sprite .pet-muzzle { fill: #ffe3b9; } .tobewin-pet-sprite .pet-gills { fill: none; stroke: #e75683; stroke-width: 7; stroke-linecap: round; } .tobewin-pet-sprite .pet-tail { fill: none; stroke: #af6b47; stroke-width: 10; stroke-linecap: round; animation: tobewin-pet-tail 1.9s ease-in-out infinite; transform-origin: 112px 105px; } .tobewin-pet-sprite .pet-bubbles { fill: rgba(255,255,255,.72); animation: tobewin-pet-bubbles 3s ease-in infinite; transform-origin: center; }
        .tobewin-pet-quick-hide, .tobewin-pet-reopen { position: absolute; z-index: 2; display: grid; width: 24px; height: 24px; place-items: center; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-overlay); box-shadow: 0 4px 12px rgba(9, 18, 34, .14); font-size: 16px; cursor: pointer; opacity: 0; transition: opacity .16s ease, transform .16s ease; } .tobewin-pet-quick-hide { top: 0; right: 0; } .tobewin-pet-dock:hover .tobewin-pet-quick-hide, .tobewin-pet-quick-hide:focus-visible { opacity: 1; } .tobewin-pet-reopen { position: relative; width: 34px; height: 34px; opacity: .92; font-size: 17px; } .tobewin-pet-reopen:hover { transform: translateY(-2px); }
        @keyframes tobewin-pet-float { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-7px) rotate(1deg); } } @keyframes tobewin-pet-ear { 0%,84%,100% { transform: rotate(0); } 89% { transform: rotate(-9deg); } 94% { transform: rotate(7deg); } } @keyframes tobewin-pet-tail { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(18deg); } } @keyframes tobewin-pet-blink { 0%,88%,92%,100% { transform: scaleY(1); } 90% { transform: scaleY(.08); } } @keyframes tobewin-pet-bubbles { 0%,75%,100% { transform: translateY(0); opacity: .2; } 24% { opacity: .9; } 70% { transform: translateY(-12px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .tobewin-pet-sprite, .tobewin-pet-sprite * { animation: none !important; } }
        .tobewin-pet-settings { display: flex; flex-direction: column; gap: 14px; } .tobewin-pet-settings-title { color: var(--dsw-alias-label-primary); font-size: 15px; font-weight: 600; line-height: 22px; } .tobewin-pet-settings-subtitle { margin: -8px 0 0; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 19px; }
        .tobewin-pet-settings-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .tobewin-pet-settings-status { color: var(--dsw-alias-label-secondary); font-size: 12px; }
        .tobewin-pet-section-label { color: var(--dsw-alias-label-primary); font-size: 13px; font-weight: 600; line-height: 19px; } .tobewin-pet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(155px, 1fr)); gap: 9px; }
        .tobewin-pet-card { display: grid; grid-template-columns: 35px minmax(0,1fr); gap: 8px; align-items: center; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 9px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1); text-align: left; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; } .tobewin-pet-card:hover, .tobewin-pet-card[aria-pressed="true"] { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent); } .tobewin-pet-card:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; } .tobewin-pet-card-emoji { display: grid; width: 35px; height: 35px; place-items: center; border-radius: 9px; background: var(--dsw-alias-state-business-secondary); font-size: 21px; } .tobewin-pet-card-name { overflow: hidden; font-size: 12px; font-weight: 600; line-height: 17px; text-overflow: ellipsis; white-space: nowrap; } .tobewin-pet-card-detail { margin-top: 1px; color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 15px; }
      `;
      document.head.appendChild(style);
    }

    function createPetLayer(store, translate) {
      let node;
      function ensure() {
        if (node?.isConnected) return node;
        node = document.createElement('div');
        node.className = 'tobewin-pet-layer';
        node.setAttribute('data-tobewin-pet-companion', 'true');
        document.body.appendChild(node);
        return node;
      }
      function render(settings) {
        const root = ensure();
        root.dataset.side = settings.side;
        root.dataset.size = settings.size;
        root.dataset.pet = settings.pet;
        root.dataset.animated = String(settings.animated);
        if (!settings.enabled) {
          root.innerHTML = `<button class="tobewin-pet-reopen" type="button" aria-label="${translate('quickShow')}" title="${translate('quickShow')}">🐾</button>`;
          root.querySelector('button')?.addEventListener('click', () => store.set({ enabled: true }));
          return;
        }
        root.innerHTML = `<div class="tobewin-pet-dock" role="group" aria-label="${translate('petLabel')}"><button class="tobewin-pet-quick-hide" type="button" aria-label="${translate('quickHide')}" title="${translate('quickHide')}">×</button><div class="tobewin-pet-sprite">${petSvg(settings.pet)}</div></div>`;
        root.querySelector('button')?.addEventListener('click', () => store.set({ enabled: false }));
      }
      return { render, dispose: () => { node?.remove(); node = undefined; } };
    }

    function Segmented({ active, items, onChange }) {
      return jsx('div', { className: 'tobewin-pet-settings-row', children: items.map((item) => jsx(Button, { variant: active === item.id ? 'primary' : 'outline', size: 'sm', onClick: () => onChange(item.id), children: item.label }, item.id)) });
    }

    function PetSettings({ locale, store }) {
      React.useSyncExternalStore(locale.subscribe.bind(locale), locale.getSnapshot.bind(locale), locale.getSnapshot.bind(locale));
      const settings = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
      const t = locale.bind(NS);
      return jsxs('section', { className: 'tobewin-pet-settings', children: [
        jsx('div', { className: 'tobewin-pet-settings-title', children: t('title') }),
        jsx('p', { className: 'tobewin-pet-settings-subtitle', children: t('subtitle') }),
        jsxs('div', { className: 'tobewin-pet-settings-row', children: [
          jsx(Button, { variant: settings.enabled ? 'outline' : 'primary', size: 'sm', onClick: () => store.set({ enabled: !settings.enabled }), children: settings.enabled ? t('hide') : t('show') }),
          jsx('span', { className: 'tobewin-pet-settings-status', children: settings.enabled ? t('enabled') : t('disabled') }),
        ] }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('template') }),
        jsx('div', { className: 'tobewin-pet-grid', children: pets.map((pet) => jsx('button', { type: 'button', className: 'tobewin-pet-card', 'aria-pressed': settings.pet === pet.id, onClick: () => store.set({ pet: pet.id, enabled: true }), children: [
          jsx('span', { className: 'tobewin-pet-card-emoji', children: pet.emoji }),
          jsxs('span', { children: [jsx('span', { className: 'tobewin-pet-card-name', children: t(pet.key) }), jsx('span', { className: 'tobewin-pet-card-detail', children: t(`${pet.key}.detail`) })] }),
        ] }, pet.id)) }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('size') }),
        jsx(Segmented, { active: settings.size, onChange: (size) => store.set({ size }), items: ['small', 'normal', 'large'].map((id) => ({ id, label: t(id) })) }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('side') }),
        jsx(Segmented, { active: settings.side, onChange: (side) => store.set({ side }), items: ['left', 'right'].map((id) => ({ id, label: t(id) })) }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('motion') }),
        jsx(Segmented, { active: settings.animated ? 'on' : 'off', onChange: (value) => store.set({ animated: value === 'on' }), items: [{ id: 'on', label: t('motionOn') }, { id: 'off', label: t('motionOff') }] }),
      ] });
    }

    function apply(ctx) {
      installStyles();
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-pet-companion: dictionaries');
      const store = createStore();
      const render = () => layer.render(store.getSnapshot());
      const layer = createPetLayer(store, (key) => ctx.locale.bind(NS)(key));
      ctx.effect(() => {
        const stopStore = store.subscribe(render);
        const stopLocale = ctx.locale.subscribe(render);
        render();
        return () => { stopStore(); stopLocale(); layer.dispose(); };
      }, 'dsh-pet-companion: floating pet');
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'tobewin-pet-companion',
        order: 18,
        label: () => ctx.locale.bind(NS)('title'),
        locale: NS,
        inject: () => ({ locale: ctx.locale, store }),
      }, PetSettings));
    }

    return { NS, apply, inject };
  },
});
