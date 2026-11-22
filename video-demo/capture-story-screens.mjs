import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME =
  "C:\\Users\\patry\\.cache\\hyperframes\\chrome\\chrome-headless-shell\\win64-158.0.8127.36\\chrome-headless-shell-win64\\chrome-headless-shell.exe";
const OUT = path.resolve("assets/story");
fs.mkdirSync(OUT, { recursive: true });

const PORT = 9333;
const proc = spawn(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1440,960",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome CDP");
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return res?.result?.value;
  }
  async goto(url, waitMs = 1800) {
    await this.send("Page.navigate", { url });
    await sleep(waitMs);
  }
  async screenshot(filename) {
    const { data } = await this.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(OUT, filename), Buffer.from(data, "base64"));
    console.log("Saved", filename);
  }
}

try {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  const cdp = new CDP(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 920,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // 1. Strona główna
  await cdp.goto("http://localhost:3000/", 1800);
  await cdp.screenshot("01-home.png");

  // 2. Kalkulator — Krok 1 (wybór roli i sytuacji rodzinnej)
  await cdp.goto("http://localhost:3000/kalkulator", 1800);
  await cdp.screenshot("02-calc-step1.png");

  // 3. Kalkulator — Przełącz na pełny widok i przewiń na REALNY WYNIK (kwota miesięczna i łączna)
  await cdp.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Pokaż pełny formularz'));
      if (btn) btn.click();
    })()
  `);
  await sleep(800);
  await cdp.eval(`
    (() => {
      const h3 = Array.from(document.querySelectorAll('h3')).find(el => el.textContent && el.textContent.includes('Łączny budżet świadczeń'));
      if (h3) h3.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy(0, -40);
    })()
  `);
  await sleep(600);
  await cdp.screenshot("03-calc-result.png");

  // 4. e-Usługi — Wniosek ZAM (podgląd gotowego druku A4 z kodem QR)
  await cdp.goto("http://localhost:3000/e-uslugi", 1800);
  await cdp.eval(`
    (() => {
      const el = Array.from(document.querySelectorAll('div,h3,span')).find(n => n.textContent && n.textContent.includes('Podgląd wydruku A4'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy(0, -24);
    })()
  `);
  await sleep(600);
  await cdp.screenshot("04-zam-a4.png");

  // 5. e-Usługi — Wniosek o urlop (Pracodawca)
  await cdp.eval(`
    (() => {
      window.scrollTo(0, 0);
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Wniosek o urlop (Pracodawca)'));
      if (btn) btn.click();
    })()
  `);
  await sleep(800);
  await cdp.screenshot("05-urlop-hr.png");

  // 6. Asystent AI — zadaj PRAWDZIWE pytanie o L4 na zleceniu po 2 mies. i poczekaj na odpowiedź z /api/chat
  await cdp.goto("http://localhost:3000/asystent-ai", 1600);
  await cdp.eval(`
    (() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, 'Czy na zleceniu po 2 miesiącach ubezpieczenia dostanę L4 w ciąży?');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()
  `);
  await sleep(300);
  await cdp.eval(`
    (() => {
      const btn = document.querySelector('button[aria-label="Wyślij wiadomość"]');
      if (btn) btn.click();
    })()
  `);
  await sleep(1800);
  await cdp.eval(`
    (() => {
      const scrollBox = document.querySelector('.overflow-y-auto');
      if (scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;
      window.scrollTo(0, 140);
    })()
  `);
  await sleep(500);
  await cdp.screenshot("06-ai-answer.png");

  // 7. Strefa Jurora — kliknij sprawa_2_wczesniak_szpital.pdf i pokaż REALNY wynik PDF + 10 tyg. uzupełniającego
  await cdp.goto("http://localhost:3000/jury-sandbox", 1600);
  await cdp.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('sprawa_2_wczesniak_szpital.pdf'));
      if (btn) {
        btn.scrollIntoView({ behavior: 'instant', block: 'center' });
        btn.click();
      }
    })()
  `);
  await sleep(1200);
  await cdp.eval(`
    (() => {
      const el = Array.from(document.querySelectorAll('span')).find(n => n.textContent && n.textContent.includes('Wyekstrahowano dane z:'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()
  `);
  await sleep(500);
  await cdp.screenshot("07-jury-pdf.png");

  // 8. Prawdziwy widok mobilny (390x844 RWD)
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await cdp.goto("http://localhost:3000/", 1600);
  await cdp.screenshot("08-mobile-home.png");

  await cdp.goto("http://localhost:3000/kalkulator", 1600);
  await cdp.screenshot("09-mobile-calc.png");

  ws.close();
} finally {
  proc.kill();
}
