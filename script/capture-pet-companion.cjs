const { app, BrowserWindow } = require('electron');
const { writeFileSync } = require('node:fs');

const [url, output] = process.argv.slice(2).filter((value) => value !== '--');
if (!url || !output) throw new Error('Usage: electron capture-pet-companion.cjs <url> <output.png>');
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function clickText(window, labels) {
  return window.webContents.executeJavaScript(`(() => {
    const labels = ${JSON.stringify(labels)};
    const element = [...document.querySelectorAll('button, [role="button"]')]
      .find((node) => labels.some((label) => node.textContent.trim() === label || node.textContent.includes(label)));
    if (!element) return false;
    element.click();
    return true;
  })()`);
}

app.whenReady().then(async () => {
  const window = new BrowserWindow({ show: false, width: 1440, height: 960 });
  await window.loadURL(url);
  await delay(800);
  await clickText(window, ['Continue', '继续']);
  await delay(260);
  if (!await clickText(window, ['Settings', '设置'])) throw new Error('Settings entry was not found');
  await delay(420);
  if (!await clickText(window, ['Pet Companion', '萌宠伴侣'])) throw new Error('Pet Companion settings section was not found');
  await delay(260);
  const initial = await window.webContents.executeJavaScript(`({
    settings: document.body.innerText.includes('Pet Companion') || document.body.innerText.includes('萌宠伴侣'),
    dock: Boolean(document.querySelector('.tobewin-pet-dock')),
    templates: document.querySelectorAll('.tobewin-pet-card').length,
  })`);
  if (!initial.settings || !initial.dock) throw new Error(`Initial pet render failed: ${JSON.stringify(initial)}`);
  if (initial.templates !== 16) throw new Error(`Expected 16 pet templates, got ${initial.templates}`);
  const layout = await window.webContents.executeJavaScript(`(() => {
    const cards = [...document.querySelectorAll('.tobewin-pet-card')];
    const grid = document.querySelector('.tobewin-pet-grid');
    const gridBounds = grid?.getBoundingClientRect();
    return { gridWidth: gridBounds?.width || 0, cards: cards.map((card) => { const box = card.getBoundingClientRect(); const art = card.querySelector('.tobewin-pet-card-art')?.getBoundingClientRect(); return { width: box.width, height: box.height, artWidth: art?.width || 0, artHeight: art?.height || 0 }; }) };
  })()`);
  if (!layout.cards.every((card) => card.height <= 90 && card.width <= layout.gridWidth && card.artWidth <= 72.5 && card.artHeight <= 72.5)) throw new Error(`Pet card layout overflowed: ${JSON.stringify(layout)}`);
  if (!await clickText(window, ['Cloud Cat', '云朵猫'])) throw new Error('Cloud Cat pet card was not found');
  await delay(100);
  const cat = await window.webContents.executeJavaScript(`document.querySelector('.tobewin-pet-layer')?.dataset.pet`);
  if (cat !== 'cat') throw new Error(`Pet selection did not apply: ${cat}`);
  if (!await clickText(window, ['Pause animation', '暂停动画'])) throw new Error('Pause animation button was not found');
  await delay(100);
  const paused = await window.webContents.executeJavaScript(`document.querySelector('.tobewin-pet-layer')?.dataset.animated`);
  if (paused !== 'false') throw new Error(`Pause state did not apply: ${paused}`);
  if (!await clickText(window, ['Hide pet', '隐藏萌宠'])) throw new Error('Hide pet button was not found');
  await delay(100);
  const hidden = await window.webContents.executeJavaScript(`Boolean(document.querySelector('.tobewin-pet-reopen'))`);
  if (!hidden) throw new Error('Quick reopen control was not rendered');
  await window.webContents.executeJavaScript(`document.querySelector('.tobewin-pet-reopen').click()`);
  await delay(120);
  const visibleAgain = await window.webContents.executeJavaScript(`Boolean(document.querySelector('.tobewin-pet-dock'))`);
  if (!visibleAgain) throw new Error('Pet could not be restored with the quick reopen control');
  await window.webContents.executeJavaScript(`document.querySelector('.tobewin-pet-dock').dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))`);
  await delay(80);
  const greeting = await window.webContents.executeJavaScript(`(() => { const node = document.querySelector('.tobewin-pet-greeting'); return { visible: node?.dataset.visible, text: node?.textContent?.trim() }; })()`);
  if (greeting.visible !== 'true' || !greeting.text) throw new Error(`Pet greeting did not appear: ${JSON.stringify(greeting)}`);
  window.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'ESC' });
  window.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'ESC' });
  await delay(240);
  const foreground = await window.webContents.executeJavaScript(`(() => {
    const dock = document.querySelector('.tobewin-pet-dock');
    if (!dock) return { ok: false, reason: 'Pet dock disappeared after closing settings' };
    const bounds = dock.getBoundingClientRect();
    const x = Math.max(0, Math.min(window.innerWidth - 1, bounds.left + bounds.width / 2));
    const y = Math.max(0, Math.min(window.innerHeight - 1, bounds.top + bounds.height / 2));
    const layer = document.querySelector('.tobewin-pet-layer');
    const layerStyle = getComputedStyle(layer);
    return { ok: layerStyle.position === 'fixed' && document.elementsFromPoint(x, y).some((element) => element.closest?.('.tobewin-pet-dock')), bounds: { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height }, layer: { side: layer?.dataset.side, position: layerStyle.position, left: layerStyle.left, right: layerStyle.right, bottom: layerStyle.bottom } };
  })()`);
  if (!foreground.ok) throw new Error(`Pet is not in the visual foreground: ${JSON.stringify(foreground)}`);
  const image = await window.webContents.capturePage();
  writeFileSync(output, image.toPNG());
  await window.destroy();
  app.quit();
});
