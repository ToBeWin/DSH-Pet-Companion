window.__ModuleLoader__.load({
  id: '@tobewin/dsh-pet-companion',
  factory: (require) => {
    const React = require('react');
    const { jsx, jsxs } = require('react/jsx-runtime');
    const { Button } = require('@deepseek-ai/dsh-client-ui-primitives');

    const NS = 'settings.tobewinPetCompanion';
    const storageKey = '@tobewin/dsh-pet-companion/settings/v1';
    const inject = ['slots', 'locale'];
    const petAssets = __PET_ASSET_MAP__;
    const pets = [
      { id: 'beaver', key: 'beaver' },
      { id: 'cat', key: 'cat' },
      { id: 'axolotl', key: 'axolotl' },
      { id: 'shiba', key: 'shiba' },
    ];
    const defaults = Object.freeze({ enabled: true, pet: 'beaver', size: 'normal', side: 'right', animated: true });

    const zh = {
      title: '萌宠伴侣',
      subtitle: '在工作区边缘放置一只精致、可关闭的动态小伙伴。所有偏好仅保存在本地。',
      enabled: '萌宠已显示', disabled: '萌宠已隐藏', show: '显示萌宠', hide: '隐藏萌宠', template: '选择萌宠',
      size: '大小', side: '停靠位置', motion: '动态效果', motionOn: '播放动画', motionOff: '暂停动画',
      small: '小', normal: '标准', large: '大', left: '左侧', right: '右侧',
      beaver: '团团海狸', 'beaver.detail': '暖棕毛绒，认真陪伴的海狸',
      cat: '云朵猫', 'cat.detail': '轻盈蓬松的薰衣草云端猫咪',
      axolotl: '桃子六角', 'axolotl.detail': '软萌好奇的粉色水精灵',
      shiba: '丸子柴', 'shiba.detail': '元气满满的焦糖小柴犬',
      quickHide: '暂时隐藏萌宠', quickShow: '显示萌宠伴侣', petLabel: '萌宠伴侣',
    };
    const en = {
      title: 'Pet Companion',
      subtitle: 'Place a polished, dismissible animated companion at the edge of your workspace. All preferences stay local.',
      enabled: 'Pet is visible', disabled: 'Pet is hidden', show: 'Show pet', hide: 'Hide pet', template: 'Choose a pet',
      size: 'Size', side: 'Dock', motion: 'Motion', motionOn: 'Play animation', motionOff: 'Pause animation',
      small: 'Small', normal: 'Normal', large: 'Large', left: 'Left', right: 'Right',
      beaver: 'Momo Beaver', 'beaver.detail': 'A warm, plush beaver who keeps you company',
      cat: 'Cloud Cat', 'cat.detail': 'A soft lavender cat from the clouds',
      axolotl: 'Peach Axolotl', 'axolotl.detail': 'A curious little rosy water sprite',
      shiba: 'Dango Shiba', 'shiba.detail': 'A spirited caramel shiba that cheers you on',
      quickHide: 'Hide pet for now', quickShow: 'Show Pet Companion', petLabel: 'Pet Companion',
    };

    function petArt(id) { return petAssets[id] || petAssets.beaver; }
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
        set: (next) => { snapshot = normalize({ ...snapshot, ...next }); try { window.localStorage.setItem(storageKey, JSON.stringify(snapshot)); } catch {} listeners.forEach((listener) => listener()); },
      };
    }

    function installStyles() {
      if (document.getElementById('tobewin-pet-companion-style')) return;
      const style = document.createElement('style');
      style.id = 'tobewin-pet-companion-style';
      style.textContent = `
        .tobewin-pet-layer { position: fixed !important; z-index: 80 !important; bottom: 18px !important; pointer-events: none; }
        .tobewin-pet-layer[data-side="right"] { right: 20px; } .tobewin-pet-layer[data-side="left"] { left: 20px; }
        .tobewin-pet-layer[data-size="small"] { --pet-size: 98px; } .tobewin-pet-layer[data-size="normal"] { --pet-size: 148px; } .tobewin-pet-layer[data-size="large"] { --pet-size: 198px; }
        .tobewin-pet-dock { position: relative; display: grid; width: var(--pet-size); height: var(--pet-size); place-items: end center; pointer-events: auto; isolation: isolate; }
        .tobewin-pet-aura { position: absolute; z-index: -1; right: 8%; bottom: 4%; left: 8%; height: 38%; border-radius: 50%; background: radial-gradient(ellipse, rgba(210, 156, 98, .48) 0%, rgba(210, 156, 98, .14) 44%, transparent 72%); filter: blur(11px); animation: tobewin-pet-aura 4.2s ease-in-out infinite; }
        .tobewin-pet-layer[data-pet="cat"] .tobewin-pet-aura { background: radial-gradient(ellipse, rgba(177, 151, 255, .48) 0%, rgba(177, 151, 255, .12) 45%, transparent 72%); } .tobewin-pet-layer[data-pet="axolotl"] .tobewin-pet-aura { background: radial-gradient(ellipse, rgba(255, 145, 180, .48) 0%, rgba(255, 145, 180, .12) 45%, transparent 72%); } .tobewin-pet-layer[data-pet="shiba"] .tobewin-pet-aura { background: radial-gradient(ellipse, rgba(255, 168, 76, .46) 0%, rgba(255, 168, 76, .12) 45%, transparent 72%); }
        .tobewin-pet-sprite { position: relative; z-index: 1; display: block; width: 100%; height: 100%; object-fit: contain; user-select: none; animation: tobewin-pet-float 4.2s cubic-bezier(.42, 0, .28, 1) infinite, tobewin-pet-breathe 3.4s ease-in-out infinite; transform-origin: center bottom; filter: drop-shadow(0 14px 18px rgba(5, 12, 24, .30)); }
        .tobewin-pet-layer[data-animated="false"] .tobewin-pet-sprite, .tobewin-pet-layer[data-animated="false"] .tobewin-pet-aura { animation-play-state: paused; }
        .tobewin-pet-quick-hide, .tobewin-pet-reopen { position: absolute; z-index: 3; display: grid; width: 25px; height: 25px; place-items: center; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-overlay); box-shadow: 0 4px 12px rgba(9, 18, 34, .14); font-size: 16px; cursor: pointer; opacity: 0; transition: opacity .16s ease, transform .16s ease; } .tobewin-pet-quick-hide { top: 3px; right: 1px; } .tobewin-pet-dock:hover .tobewin-pet-quick-hide, .tobewin-pet-quick-hide:focus-visible { opacity: 1; } .tobewin-pet-reopen { position: relative; width: 34px; height: 34px; opacity: .92; font-size: 17px; } .tobewin-pet-reopen:hover { transform: translateY(-2px); }
        @keyframes tobewin-pet-float { 0%,100% { transform: translateY(0) rotate(-1.2deg); } 50% { transform: translateY(-9px) rotate(1.2deg); } } @keyframes tobewin-pet-breathe { 0%,100% { scale: 1; } 50% { scale: 1.018 .992; } } @keyframes tobewin-pet-aura { 0%,100% { transform: scale(.93); opacity: .62; } 50% { transform: scale(1.08); opacity: .95; } }
        @media (prefers-reduced-motion: reduce) { .tobewin-pet-sprite, .tobewin-pet-aura { animation: none !important; } }
        .tobewin-pet-settings { display: flex; flex-direction: column; gap: 14px; } .tobewin-pet-settings-title { color: var(--dsw-alias-label-primary); font-size: 15px; font-weight: 600; line-height: 22px; } .tobewin-pet-settings-subtitle { margin: -8px 0 0; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 19px; } .tobewin-pet-settings-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .tobewin-pet-settings-status { color: var(--dsw-alias-label-secondary); font-size: 12px; }
        .tobewin-pet-section-label { color: var(--dsw-alias-label-primary); font-size: 13px; font-weight: 600; line-height: 19px; } .tobewin-pet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(205px, 1fr)); gap: 10px; }
        .tobewin-pet-card { display: grid; grid-template-columns: 62px minmax(0, 1fr); min-height: 78px; gap: 10px; align-items: center; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 8px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-1); text-align: left; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease; } .tobewin-pet-card:hover, .tobewin-pet-card[aria-pressed="true"] { border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent); } .tobewin-pet-card:hover { transform: translateY(-1px); } .tobewin-pet-card:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
        .tobewin-pet-card-art { display: grid; width: 62px; height: 62px; place-items: end center; overflow: hidden; border-radius: 9px; background: radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--dsw-alias-brand-primary) 25%, transparent), transparent 69%), var(--dsw-alias-state-business-secondary); } .tobewin-pet-card-art img { width: 78px; height: 78px; object-fit: contain; transform: translateY(7px); filter: drop-shadow(0 6px 7px rgba(7, 12, 24, .20)); } .tobewin-pet-card-name { display: block; overflow: hidden; font-size: 12px; font-weight: 600; line-height: 17px; text-overflow: ellipsis; white-space: nowrap; } .tobewin-pet-card-detail { display: block; margin-top: 2px; color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 15px; }
      `;
      document.head.appendChild(style);
    }

    function createPetLayer(store, translate) {
      let node;
      function ensure() { if (node?.isConnected) return node; node = document.createElement('div'); node.className = 'tobewin-pet-layer'; node.setAttribute('data-tobewin-pet-companion', 'true'); document.body.appendChild(node); return node; }
      function render(settings) {
        const root = ensure(); root.dataset.side = settings.side; root.dataset.size = settings.size; root.dataset.pet = settings.pet; root.dataset.animated = String(settings.animated);
        if (!settings.enabled) { root.innerHTML = `<button class="tobewin-pet-reopen" type="button" aria-label="${translate('quickShow')}" title="${translate('quickShow')}">🐾</button>`; root.querySelector('button')?.addEventListener('click', () => store.set({ enabled: true })); return; }
        root.innerHTML = `<div class="tobewin-pet-dock" role="group" aria-label="${translate('petLabel')}"><button class="tobewin-pet-quick-hide" type="button" aria-label="${translate('quickHide')}" title="${translate('quickHide')}">×</button><div class="tobewin-pet-aura" aria-hidden="true"></div><img class="tobewin-pet-sprite" src="${petArt(settings.pet)}" alt="" draggable="false"></div>`;
        root.querySelector('button')?.addEventListener('click', () => store.set({ enabled: false }));
      }
      return { render, dispose: () => { node?.remove(); node = undefined; } };
    }
    function Segmented({ active, items, onChange }) { return jsx('div', { className: 'tobewin-pet-settings-row', children: items.map((item) => jsx(Button, { variant: active === item.id ? 'primary' : 'outline', size: 'sm', onClick: () => onChange(item.id), children: item.label }, item.id)) }); }
    function PetSettings({ locale, store }) {
      React.useSyncExternalStore(locale.subscribe.bind(locale), locale.getSnapshot.bind(locale), locale.getSnapshot.bind(locale));
      const settings = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot); const t = locale.bind(NS);
      return jsxs('section', { className: 'tobewin-pet-settings', children: [
        jsx('div', { className: 'tobewin-pet-settings-title', children: t('title') }), jsx('p', { className: 'tobewin-pet-settings-subtitle', children: t('subtitle') }),
        jsxs('div', { className: 'tobewin-pet-settings-row', children: [jsx(Button, { variant: settings.enabled ? 'outline' : 'primary', size: 'sm', onClick: () => store.set({ enabled: !settings.enabled }), children: settings.enabled ? t('hide') : t('show') }), jsx('span', { className: 'tobewin-pet-settings-status', children: settings.enabled ? t('enabled') : t('disabled') })] }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('template') }),
        jsx('div', { className: 'tobewin-pet-grid', children: pets.map((pet) => jsx('button', { type: 'button', className: 'tobewin-pet-card', 'aria-pressed': settings.pet === pet.id, onClick: () => store.set({ pet: pet.id, enabled: true }), children: [jsx('span', { className: 'tobewin-pet-card-art', children: jsx('img', { src: petArt(pet.id), alt: '', draggable: false }) }), jsxs('span', { children: [jsx('span', { className: 'tobewin-pet-card-name', children: t(pet.key) }), jsx('span', { className: 'tobewin-pet-card-detail', children: t(`${pet.key}.detail`) })] })] }, pet.id)) }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('size') }), jsx(Segmented, { active: settings.size, onChange: (size) => store.set({ size }), items: ['small', 'normal', 'large'].map((id) => ({ id, label: t(id) })) }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('side') }), jsx(Segmented, { active: settings.side, onChange: (side) => store.set({ side }), items: ['left', 'right'].map((id) => ({ id, label: t(id) })) }),
        jsx('div', { className: 'tobewin-pet-section-label', children: t('motion') }), jsx(Segmented, { active: settings.animated ? 'on' : 'off', onChange: (value) => store.set({ animated: value === 'on' }), items: [{ id: 'on', label: t('motionOn') }, { id: 'off', label: t('motionOff') }] }),
      ] });
    }
    function apply(ctx) {
      installStyles(); ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-pet-companion: dictionaries');
      const store = createStore(); const layer = createPetLayer(store, (key) => ctx.locale.bind(NS)(key)); const render = () => layer.render(store.getSnapshot());
      ctx.effect(() => { const stopStore = store.subscribe(render); const stopLocale = ctx.locale.subscribe(render); render(); return () => { stopStore(); stopLocale(); layer.dispose(); }; }, 'dsh-pet-companion: floating pet');
      ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'tobewin-pet-companion', order: 18, label: () => ctx.locale.bind(NS)('title'), locale: NS, inject: () => ({ locale: ctx.locale, store }) }, PetSettings));
    }
    return { NS, apply, inject };
  },
});
