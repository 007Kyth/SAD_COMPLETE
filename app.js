const STAFF_CODE = "CCTC-STAFF-2026";
let authMode = "login";
const K = "cctc_mart_v3",
  $ = (s) => document.querySelector(s),
  uid = () => Math.random().toString(36).slice(2, 9);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const peso = (n) =>
  "₱" +
  Number(n || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const seed = () => ({
  me: null,
  view: "home",
  tab: {},
  cart: {},
  users: [
    {
      id: "t1",
      name: "Ms. Reyes",
      role: "teacher",
      wallet: 1000,
      pos: "Registrar",
      phone: "0917-000-0001",
    },
    {
      id: "t2",
      name: "Mr. Cruz",
      role: "teacher",
      wallet: 1000,
      pos: "Treasurer",
      phone: "0917-000-0002",
    },
    {
      id: "t3",
      name: "Mr. Dela Cruz",
      role: "teacher",
      wallet: 1000,
      pos: "Teacher",
      phone: "0917-000-0003",
    },
    {
      id: "s1",
      name: "Ana Lim",
      role: "student",
      wallet: 1000,
      level: "Senior High School",
      grade: "Grade 11",
      block: "Block A",
      strand: "STEM",
      phone: "0917-100-0001",
    },
    {
      id: "s2",
      name: "Ben Tan",
      role: "student",
      wallet: 1000,
      level: "College",
      grade: "2nd Year",
      block: "Block B",
      strand: "BSIT",
      phone: "0917-100-0002",
    },
    {
      id: "s3",
      name: "Cara Uy",
      role: "student",
      wallet: 1000,
      level: "Junior High School",
      grade: "Grade 8",
      block: "Block C",
      strand: "",
      phone: "0917-100-0003",
    },
  ],
  ann: [
    {
      id: "a1",
      text: "New PE shirts arrive next week. Check the Main Store for sizes.",
      by: "t1",
      at: Date.now() - 36e5 * 20,
    },
  ],
  products: [
    {
      id: "p1",
      name: "Official Polo Uniform",
      cat: "Uniform",
      desc: "CCTC light-blue polo.",
      price: 350,
      sizes: {
        S: { q: 12 },
        M: { q: 0 },
        L: { q: 5 },
        XL: { q: 3, price: 380 },
      },
      qty: 0,
      img: "",
    },
    {
      id: "p2",
      name: "PE Shirt",
      cat: "Uniform",
      desc: "Breathable PE shirt.",
      price: 280,
      sizes: { M: { q: 6 }, L: { q: 0 } },
      qty: 0,
      img: "",
    },
    {
      id: "p3",
      name: "College Algebra Textbook",
      cat: "Books",
      desc: "Required for Math 101.",
      price: 420,
      sizes: null,
      qty: 8,
      img: "",
    },
    {
      id: "p4",
      name: "Notebook Pack (5)",
      cat: "School Supplies",
      desc: "Spiral notebooks.",
      price: 150,
      sizes: null,
      qty: 0,
      img: "",
    },
  ],
  subs: [
    {
      id: "x1",
      owner: "s1",
      name: "Used Scientific Calculator",
      cat: "School Supplies",
      desc: "Works great.",
      cond: "Good",
      price: 250,
      size: "",
      qty: 1,
      contact: "0917-100-0001",
      photos: [],
      status: "pending",
      at: Date.now() - 72e5,
    },
  ],
  listings: [
    {
      id: "l1",
      subId: "x0",
      owner: "s2",
      name: "Used PE Shirt",
      cat: "Uniform",
      desc: "Worn a few times, clean.",
      cond: "Good",
      price: 120,
      size: "M",
      qty: 1,
      contact: "0917-100-0002",
      photos: [],
      status: "live",
    },
  ],
  orders: [],
  chat: [
    {
      id: "c1",
      by: "t1",
      text: "Welcome to CCTC Mini Mart! Official announcements appear here.",
      at: Date.now() - 864e5,
    },
  ],
  seq: 1000,
  treasury: 0,
  ledger: [],
  threads: [],
  notes: [],
  dms: [],
});
let S;
try {
  S = JSON.parse(localStorage.getItem(K));
} catch (e) {}
if (!S || !S.users) S = seed();
S.notes = S.notes || [];
S.dms = S.dms || [];
S.threads = S.threads || [];
S.ledger = S.ledger || [];
S.treasury = S.treasury || 0;
S.users.forEach((u) => {
  if (u.wallet === undefined) u.wallet = 1000;
});
// Built-in administrator account. Default login: admin@cctc.edu / Admin@1234
// (change the password from the Accounts page). Only the salted hash is stored.
const ADMIN_DEFAULT = {
  id: "ad1",
  name: "Administrator",
  role: "admin",
  email: "admin@cctc.edu",
  salt: "cctc-admin-salt",
  hash: "071a0531992c02a4a873d3d05959bcff857bb5087b8b0fe352279b2b3deec9b1",
};
function ensureAdmin() {
  if (!S.users.some((u) => u.role === "admin")) S.users.push({ ...ADMIN_DEFAULT });
}
ensureAdmin();
const save = () => {
  try {
    localStorage.setItem(K, JSON.stringify(S));
  } catch (e) {
    toast("Storage full: remove large photos", "err");
  }
};
const U = (id) => S.users.find((u) => u.id === id) || { name: "Unknown" },
  me = () => U(S.me),
  isT = () => S.me && me().role === "teacher",
  isAdmin = () => S.me && me().role === "admin";
const P = (id) => S.products.find((p) => p.id === id);
const stock = (p, sz) => (p.sizes ? p.sizes[sz]?.q || 0 : p.qty),
  unit = (p, sz) => (p.sizes && p.sizes[sz]?.price) || p.price;
const toast = (m, t) => {
  const d = document.createElement("div");
  d.className = "toast " + (t || "");
  d.textContent = m;
  $("#toasts").append(d);
  setTimeout(() => d.remove(), 3200);
};
const guard = (r) => {
  const ok = r === "teacher" ? isT() : r === "mgr" ? isMgr() : true;
  if (!ok) {
    toast(
      r === "mgr"
        ? "Only the Registrar or Treasurer can manage the shop"
        : "Not permitted for your role",
      "err",
    );
    return false;
  }
  return true;
};
const badge = (s) => `<span class="badge b-${s}">${esc(LBL[s] || s)}</span>`;
const imgBox = (src, ic) =>
  `<div class="img">${src ? `<img src="${src}" alt="">` : ic || "🛡️"}</div>`;
const empty = (m) => `<div class="empty">⚜ ${esc(m)}</div>`;
function openModal(t, b) {
  const d = $("#dlg");
  d.innerHTML = `<div class="orn" style="border:0"><button class="btn sm" data-act="close" style="float:right" aria-label="Close dialog" title="Close">✕ Close</button><h2>${esc(t)}</h2>${b}</div>`;
  if (!d.open) d.showModal();
}
const closeModal = () => $("#dlg").close();
$("#dlg").addEventListener("click", (e) => {
  const r = e.target.getBoundingClientRect();
  if (
    e.target === e.currentTarget &&
    (e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom)
  )
    closeModal();
});
function confirmDlg(m) {
  return new Promise((r) => {
    const c = $("#cfm");
    c.innerHTML = `<h3>Please confirm</h3><p>${esc(m)}</p><div class="row"><button class="btn" id="no">Cancel</button><button class="btn d" id="yes">Confirm</button></div>`;
    c.showModal();
    c.querySelector("#no").onclick = () => {
      c.close();
      r(false);
    };
    c.querySelector("#yes").onclick = () => {
      c.close();
      r(true);
    };
    c.oncancel = () => r(false);
  });
}
const readFiles = (inp, max = 3) =>
  Promise.all(
    [...(inp?.files || [])].slice(0, max).map(
      (f) =>
        new Promise((res, rej) => {
          if (f.size > 400000) return rej("Each image must be under 400 KB");
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.readAsDataURL(f);
        }),
    ),
  );
const TN = [
    ["home", "🏰 Home"],
    ["store", "🏪 Store"],
    ["shop", "🛍️ Shop"],
    ["chat", "💬 Chat"],
    ["orders", "📦 Orders"],
    ["my", "🧾 My Orders"],
    ["requests", "📝 Requests"],
    ["profile", "👤 Profile"],
    ["settings", "⚙️ Settings"],
  ],
  SN = [
    ["home", "🏰 Home"],
    ["shop", "🛍️ Shop"],
    ["chat", "💬 Chat"],
    ["request", "📝 Teacher Request"],
    ["orders", "📦 Orders"],
    ["profile", "👤 Profile"],
    ["settings", "⚙️ Settings"],
  ];
// Administrator navigation: the admin only sees the Accounts page.
const AN = [["accounts", "👥 Accounts"]];
const tab = (k, d) => S.tab[k] || d;
function render() {
  applyPrefs();
  const a = $("#app");
  if (!S.me) {
    a.innerHTML = authView();
    if (authMode === "reg") regUI();
    return;
  }
  const t = isT(),
    adm = isAdmin(),
    nav = adm ? AN : t ? TN : SN;
  if (!nav.some((n) => n[0] === S.view)) S.view = nav[0][0];
  const cc = Object.values(S.cart[S.me] || {}).reduce((s, i) => s + i.qty, 0);
  a.innerHTML = `<header><div class="brand"><span class="crest">🛡️</span><span class="serif">CCTC Mini Mart</span></div>
 <nav aria-label="Main">${nav.map((n) => `<button data-act="nav" data-v="${n[0]}" ${S.view === n[0] ? 'aria-current="page"' : ""}>${n[1]}${n[0] === "chat" && chatCount() ? ` <span class="badge b-reserved">${chatCount()}</span>` : ""}</button>`).join("")}</nav>
 <div class="sp">${adm ? "" : `<button class="btn" data-act="cart" title="Shopping cart" aria-label="Cart, ${cc} items">🛒 ${cc ? `<b>${cc}</b>` : ""}</button>`}${adm ? '<span class="badge b-pending">Admin</span>' : `<span class="badge b-live" title="Demo GCash wallet">💳 ${peso(me().wallet)}</span>`}${avSm(me())}<span class="note">${esc(me().name)}</span><button class="btn sm" data-act="logout" title="Sign out">Sign out</button></div></header>
 <main>${notesCard()}<div class="view" key="${S.view}">${V[(adm ? "a_" : t ? "t_" : "s_") + S.view]()}</div></main>`;
  if (isT() && !isMgr())
    document
      .querySelectorAll(
        '[data-act="prodForm"],[data-act="prodDel"],[data-act="post"],[data-act="lst"],[data-act="lstEdit"],[data-act="subDec"]',
      )
      .forEach((x) => x.remove());
  const m = document.querySelector(".msgs");
  if (m) m.scrollTop = m.scrollHeight;
}
// Pure JavaScript SHA-256. Used when crypto.subtle is unavailable (for example on a
// non-secure page such as http://192.168.x.x), so password hashes stay consistent.
function sha256Hex(str) {
  const kk = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const msg = new TextEncoder().encode(str),
    len = msg.length,
    total = ((len + 9 + 63) >> 6) << 6,
    buf = new Uint8Array(total);
  buf.set(msg);
  buf[len] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(total - 4, (len * 8) >>> 0);
  view.setUint32(total - 8, Math.floor((len * 8) / 4294967296));
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const w = new Array(64),
    rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < total; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(o + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3),
        s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + kk[i] + w[i]) | 0,
        t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, hh].forEach((v, i) => (h[i] = (h[i] + v) | 0));
  }
  return h.map((x) => (x >>> 0).toString(16).padStart(8, "0")).join("");
}
async function hash(p, s) {
  try {
    const b = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(s + p),
    );
    return [...new Uint8Array(b)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  } catch (e) {
    return sha256Hex(s + p);
  }
}
function authView() {
  const reg = authMode === "reg";
  const login = `<form data-form="login"><label for="le">Gmail / email</label><input id="le" name="email" type="email" required autocomplete="email"><label for="lp">Password</label><input id="lp" name="password" type="password" required autocomplete="current-password"><br><button class="btn p" style="width:100%">Log in</button></form>`;
  const regf = `<form id="rf" data-form="reg"><label>Full name</label><input name="name" required maxlength="80" autocomplete="name"><label>Gmail / email</label><input name="email" type="email" required autocomplete="email"><label>Password (at least 6 characters)</label><input name="password" type="password" minlength="6" required autocomplete="new-password">
 <div class="row"><div><label>Gender</label><select name="gender"><option>Male</option><option>Female</option><option>Prefer not to say</option></select></div><div><label>Age</label><input name="age" type="number" min="10" max="99" required></div></div>
 <label>Contact number (optional)</label><input name="phone" autocomplete="tel"><label>I am a</label><select name="role"><option value="student">Student</option><option value="teacher">Teacher / Staff</option></select>
 <div id="tg" hidden><label>School role</label><select name="pos"><option value="Teacher">Teacher only (cannot manage the shop)</option><option>Registrar</option><option>Treasurer</option></select><label>Staff access code</label><input name="code" type="password" autocomplete="off"><p class="note">Demo code: ${STAFF_CODE} (a real system would give this out privately).</p></div>
 <div id="sg"><label>Level</label><select name="level"><option>Junior High School</option><option>Senior High School</option><option>College</option></select><div class="row"><div><label>Year / grade</label><select name="grade"></select></div><div><label>Section / block</label><input name="block" maxlength="30"></div></div><div id="stg"><label id="stl">Strand</label><input name="strand" list="sl" maxlength="40"><datalist id="sl"><option>HUMSS</option><option>GAS</option><option>STEM</option><option>ABM</option></datalist></div></div><br><button class="btn p" style="width:100%">Create account</button></form>`;
  return `<div class="login orn card"><h1 class="serif" style="text-align:center">⚜ CCTC Mini Mart ⚜</h1><p style="text-align:center;color:var(--mut)">Campus Marketplace</p><div class="tabs" style="justify-content:center"><button class="btn" aria-pressed="${!reg}" data-act="auth" data-v="login">Log in</button><button class="btn" aria-pressed="${reg}" data-act="auth" data-v="reg">Create account</button></div>${reg ? regf : login}
 <details style="margin-top:1rem"><summary class="note">Demo accounts (prototype shortcut)</summary>${S.users
   .filter((u) => !u.hash)
   .map(
     (u) =>
       `<button class="btn who" data-act="login" data-id="${u.id}">${u.role === "teacher" ? "🎓" : "🎒"} <b>${esc(u.name)}</b> — ${esc(u.pos || u.level)}</button>`,
   )
   .join("")}</details>
 <p class="note">Accounts are saved in this browser. Passwords are salted and hashed, but this is a front-end prototype: real security needs a server.</p><button class="btn sm" data-act="reset">Reset demo data</button></div>`;
}
function regUI() {
  const f = $("#rf");
  if (!f) return;
  const t = f.role.value === "teacher",
    lv = f.level.value;
  $("#tg").hidden = !t;
  $("#sg").hidden = t;
  f.code.required = t;
  f.block.required = !t;
  if (f.dataset.lv !== lv) {
    f.dataset.lv = lv;
    f.grade.innerHTML = {
      "Junior High School": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
      "Senior High School": ["Grade 11", "Grade 12"],
      College: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    }[lv]
      .map((y) => `<option>${y}</option>`)
      .join("");
  }
  $("#stg").hidden = lv === "Junior High School";
  f.strand.required = !t && lv !== "Junior High School";
  $("#stl").textContent =
    lv === "College" ? "Course (e.g. BSIT)" : "Strand (HUMSS, GAS, STEM, ABM)";
  lv === "College"
    ? f.strand.removeAttribute("list")
    : f.strand.setAttribute("list", "sl");
}
function studentHome() {
  const u = me(),
    mine = S.orders.filter((o) => o.student === S.me),
    act = mine.filter((o) => !["claimed", "cancelled"].includes(o.status)).length,
    claim = mine.filter((o) => ["payment_approved", "ready"].includes(o.status)).length,
    rej = mine.filter((o) => o.status === "payment_rejected").length,
    stk = S.products.filter((p) => (p.sizes ? Object.values(p.sizes).some((z) => z.q > 0) : p.qty > 0)).length,
    sh = S.listings.filter((l) => l.status === "live").length;
  return `<h2>Welcome, ${esc(u.name.split(" ")[0])} 👋</h2><section class="orn card"><h3>📣 Announcements</h3>${
    S.ann.slice().reverse().map((a) => `<p>${esc(a.text)} <span class="note">— ${esc(U(a.by).name)}</span></p>`).join("") || empty("No announcements")
  }</section>
 ${rej ? `<div class="card alert er">⚠️ ${rej} order(s) had a payment rejected. Open Orders to read the reason and resubmit. <button class="btn sm" data-act="nav" data-v="orders">View orders</button></div>` : ""}
 ${claim ? `<div class="card alert">📦 ${claim} order(s) cleared for claiming. Visit the Registrar's office in person. <button class="btn sm" data-act="nav" data-v="orders">View orders</button></div>` : ""}
 <div class="grid tiles"><button class="card h stat" data-act="nav" data-v="shop"><b>${stk}</b>products in stock</button><button class="card h stat" data-act="goSh"><b>${sh}</b>second-hand items</button><button class="card h stat" data-act="nav" data-v="orders"><b>${act}</b>active orders</button><button class="card h stat" data-act="nav" data-v="chat"><b>${chatCount()}</b>chats and requests</button></div>
 <section class="orn card" style="margin-top:1.5rem"><h2 class="serif">⚜ About CCTC Mini Mart</h2><p>CCTC Mini Mart is the campus marketplace of CCTC. The <b>Main Store</b> sells official school products such as uniforms, books and supplies. The <b>Second-Hand Store</b> lets students sell used school items to each other, and teachers only review and post the listings.</p>
 <h3>How buying works</h3><ol><li>Browse the Main Store, pick a size and quantity, and add items to your cart.</li><li>Place your order and send your payment details. It starts as Pending Payment.</li><li>The Treasurer checks your payment and approves or rejects it.</li><li>After approval, the Registrar prepares your order.</li><li>Visit the Registrar's office in person to claim it.</li></ol>
 <p class="note">Second-hand deals are arranged face to face between buyer and seller. The school does not handle those payments. Questions? Check Chat for announcements or visit the Registrar or Treasurer office.</p></section>`;
}
function homeView(ed) {
  const n = (v, t) => `<div class="card tile"><b>${v}</b>${t}</div>`;
  return `<h2>School Home</h2><section class="orn card"><h3>📣 Announcements</h3>${
    S.ann.length ? S.ann.slice().reverse().map((a) => `<p>${esc(a.text)} <span class="note">— ${esc(U(a.by).name)}</span></p>`).join("") : empty("No announcements")
  }${ed ? `<button class="btn sm" data-act="annForm">+ Announcement</button>` : ""}</section>
 ${ed ? `<div class="grid tiles">${n(S.orders.filter((o) => o.status === "pending_payment").length, "orders pending payment")}${n(S.subs.filter((x) => x.status === "pending").length, "resell requests to review")}${n(S.subs.filter((x) => x.status === "approved").length, "approved, ready to post")}${n(S.products.filter((p) => (p.sizes ? Object.values(p.sizes).every((z) => !z.q) : !p.qty)).length, "sold-out products")}</div>` : ""}`;
}
const chips = (p, sel) =>
  p.sizes
    ? `<div class="chips" role="group" aria-label="Sizes">${Object.keys(p.sizes)
        .sort((a, b) => SIZES.indexOf(a) - SIZES.indexOf(b))
        .map((z) => {
          const q = p.sizes[z].q;
          return `<button type="button" class="chip ${q ? "ok" : "no"} ${sel === z ? "sel" : ""}" ${q ? `data-act="pick" data-id="${p.id}" data-z="${z}"` : "disabled"} title="${q ? q + " available" : "No stock"}">${z}: ${q || "out"}</button>`;
        })
        .join("")}</div>`
    : `<div class="chips"><span class="chip ${p.qty ? "ok" : "no"}" style="cursor:default">${p.qty ? p.qty + " in stock" : "Out of stock"}</span></div>`;
const picks = {};
const V = {
  t_home: () => homeView(true),
  t_shop: () => V.s_shop(),
  t_my: () => V.s_orders(),
  s_home: studentHome,
  t_store: () => {
    const tb = tab("store", "main");
    return (
      `<h2>Store</h2>${isMgr() ? "" : '<p class="note">View only: only the Registrar and Treasurer can manage the shop.</p>'}<div class="tabs"><button class="btn" aria-pressed="${tb === "main"}" data-act="tab" data-k="store" data-v="main">Main Store</button><button class="btn" aria-pressed="${tb === "sh"}" data-act="tab" data-k="store" data-v="sh">Second-Hand Store</button></div>` +
      (tb === "main"
        ? `<button class="btn p" data-act="prodForm">+ Add product</button><br><br><div class="grid">${S.products.map((p) => `<article class="card h">${imgBox(p.img, "👕")}<h3>${esc(p.name)}</h3><span class="note">${esc(p.cat)}</span><div class="price">${peso(p.price)}</div>${chips(p)}<button class="btn sm" data-act="prodForm" data-id="${p.id}">Edit</button> <button class="btn sm d" data-act="prodDel" data-id="${p.id}">Remove</button></article>`).join("") || empty("No products")}</div>`
        : `<h3>Approved — ready to post</h3><div class="grid">${
            S.subs
              .filter((s) => s.status === "approved")
              .map((s) =>
                subCard(
                  s,
                  `<button class="btn p sm" data-act="post" data-id="${s.id}">Post to students</button>`,
                ),
              )
              .join("") || empty("Nothing waiting to be posted")
          }</div><h3 style="margin-top:1.5rem">Listings</h3><div class="grid">${S.listings.map((l) => subCard(l, `${badge(l.status)}<br>` + (l.status === "live" ? `<button class="btn sm" data-act="lst" data-id="${l.id}" data-s="unpublished">Unpublish</button> <button class="btn sm" data-act="lst" data-id="${l.id}" data-s="sold">Mark sold</button>` : `<button class="btn sm" data-act="lst" data-id="${l.id}" data-s="live">Republish</button>`) + ` <button class="btn sm" data-act="lstEdit" data-id="${l.id}">Edit</button>`)).join("") || empty("No listings yet")}</div>`)
    );
  },
  s_shop: () => {
    const tb = tab("shop", "main");
    return (
      `<h2>Shop</h2><div class="tabs"><button class="btn" aria-pressed="${tb === "main"}" data-act="tab" data-k="shop" data-v="main">Main Store</button><button class="btn" aria-pressed="${tb === "sh"}" data-act="tab" data-k="shop" data-v="sh">Second-Hand Store</button></div>` +
      (tb === "main"
        ? `<div class="grid">${S.products
            .map((p) => {
              const out = p.sizes
                  ? Object.values(p.sizes).every((z) => !z.q)
                  : !p.qty,
                sel = picks[p.id];
              return `<article class="card h">${imgBox(p.img, "👕")}<h3>${esc(p.name)}</h3><span class="note">${esc(p.cat)}</span><p>${esc(p.desc)}</p><div class="price">${peso(p.sizes && sel ? unit(p, sel) : p.price)}</div>${chips(p, sel)}<div class="row"><input type="number" min="1" value="1" id="q_${p.id}" aria-label="Quantity" style="flex:0 0 70px"><button class="btn p" data-act="add" data-id="${p.id}" ${out ? "disabled" : ""}>Add to cart</button></div></article>`;
            })
            .join("")}</div>`
        : `<div class="grid">${
            S.listings
              .filter((l) => ["live", "reserved"].includes(l.status))
              .map((l) =>
                subCard(
                  l,
                  `<span class="note">Seller: ${nameLink(U(l.owner))} · ☎ ${esc(l.contact)}</span><br>${l.status === "reserved" ? '<span class="badge b-reserved">In order process</span>' : l.owner === S.me ? '<span class="badge b-pending">Your listing</span>' : `<button class="btn p sm" data-act="buy" data-id="${l.id}">Buy · chat with seller</button>`}<br><span class="note">Face-to-face payment only; no online payment.</span>`,
                ),
              )
              .join("") || empty("No second-hand items posted yet")
          }</div>`)
    );
  },
  t_chat: () => chatView(true),
  s_chat: () => chatView(false),
  t_orders: () =>
    `<h2>Orders</h2><p class="note">Signed in as ${esc(me().pos)}: ${{ Treasurer: "you verify and approve or reject payments.", Registrar: "you prepare orders and release them when the student collects in person." }[me().pos] || "view only (no payment or release permissions)."}</p>` +
    ordTable(S.orders, true),
  t_requests: () => {
    const tb = tab("req", "ord"),
      po = S.orders.filter(queue),
      ps = S.subs;
    return (
      `<h2>Requests</h2><div class="tabs"><button class="btn" aria-pressed="${tb === "ord"}" data-act="tab" data-k="req" data-v="ord">${pos() === "Treasurer" ? "Payment Verification" : pos() === "Registrar" ? "Ready for Claiming" : "Orders"} (${po.length})</button><button class="btn" aria-pressed="${tb === "res"}" data-act="tab" data-k="req" data-v="res">Resell Requests (${ps.filter((s) => s.status === "pending").length})</button></div>` +
      (tb === "ord"
        ? (pos() === "Treasurer" ? payPanel() : "") + ordTable(po, true)
        : `<div class="grid">${
            ps
              .slice()
              .reverse()
              .map((s) =>
                subCard(
                  s,
                  `${badge(s.status)}<p class="note">Seller: ${esc(U(s.owner).name)}</p>` +
                    (s.status === "pending"
                      ? `<button class="btn p sm" data-act="subDec" data-id="${s.id}" data-s="approved">Approve</button> <button class="btn d sm" data-act="subDec" data-id="${s.id}" data-s="declined">Decline</button>`
                      : s.status === "approved"
                        ? `<p class="note">Approved. Publish from Store → Second-Hand.</p>`
                        : ""),
                ),
              )
              .join("") || empty("No resell requests")
          }</div>`)
    );
  },
  s_request:
    () => `<h2>Teacher Request — Sell a Used Item</h2><form class="orn card" data-form="sub"><div class="row"><div><label for="n">Product name</label><input id="n" name="name" required maxlength="80"></div><div><label for="c">Category</label><select id="c" name="cat"><option>Uniform</option><option>Books</option><option>School Supplies</option><option>Other</option></select></div></div>
 <label for="d">Description</label><textarea id="d" name="desc" rows="2" required></textarea>
 <div class="row"><div><label for="cd">Condition</label><select id="cd" name="cond"><option>Like new</option><option>Good</option><option>Fair</option><option>Worn</option></select></div><div><label for="pr">Price (₱)</label><input id="pr" name="price" type="number" min="1" step="0.01" required></div><div><label for="sz">Size (if any)</label><select id="sz" name="size"><option value="">N/A</option>${SIZES.map((z) => `<option>${z}</option>`).join("")}</select></div><div><label for="qt">Quantity</label><input id="qt" name="qty" type="number" min="1" value="1" required></div></div>
 <label for="ct">Seller contact (shown to logged-in students once posted)</label><input id="ct" name="contact" value="${esc(me().phone)}" required>
 <label for="ph">Photos as proof (1–3, under 400 KB each)</label><input id="ph" name="photos" type="file" accept="image/*" multiple required><br><button class="btn p">Submit for review</button></form>
 <h3 style="margin-top:1.5rem">My submissions</h3><div class="grid">${
   S.subs
     .filter((s) => s.owner === S.me)
     .map((s) => subCard(s, badge(s.status)))
     .join("") || empty("No submissions yet")
 }</div>`,
  s_orders: () =>
    `<h2>My Orders</h2><div class="card orn"><b>Payment instructions</b><p class="note">${PAYINFO}</p></div><br>` +
    ordTable(
      S.orders.filter((o) => o.student === S.me),
      false,
    ),
  t_profile: () => profileView(),
  s_profile: () => profileView(),
};
function subCard(s, foot) {
  return `<article class="card h">${imgBox((s.photos || [])[0], "📦")}<h3>${esc(s.name)}</h3><span class="note">${esc(s.cat)} · ${esc(s.cond)}${s.size ? " · Size " + esc(s.size) : ""}</span><p>${esc(s.desc)}</p><div class="price">${peso(s.price)}</div><p class="note">Qty: ${s.qty}</p>${foot}</article>`;
}
function chatView(t) {
  const f = tab("chat", "ann");
  return chatTabs() + (f === "msg" ? msgView() : f === "req" ? reqView() : f === "ppl" ? pplView() : annView(t));
}
function annView(t) {
  return `<h2>Marketplace Announcements</h2><section class="card chat orn"><div class="msgs" tabindex="0" aria-label="Messages">${S.chat.map((m) => `<div class="msg${m.by === S.me ? " me" : ""}"><small><b>${nameLink(U(m.by))}</b> · official · ${new Date(m.at).toLocaleString("en-PH")}</small><div>${esc(m.text)}</div></div>`).join("")}</div>${t ? `<form data-form="chat" class="row" style="flex-wrap:nowrap;margin-top:.5rem"><input name="text" required placeholder="Post an official announcement…" aria-label="Message"><button class="btn p" style="flex:0">Send</button></form>` : `<p class="note">Only teachers can post official announcements.</p>`}</section>`;
}
const LBL = {
  pending_payment: "Pending Payment",
  payment_rejected: "Payment Rejected",
  payment_approved: "Payment Approved — Awaiting Claim",
  ready: "Ready for Claiming",
  claimed: "Completed / Claimed",
  cancelled: "Cancelled",
  reserved: "In order process",
};
const PAYINFO =
  "Choose GCash (online wallet) to pay from your demo wallet: the amount is deducted only when the Treasurer approves your order. Choose Face to face to hand cash to the Treasurer in person; she approves once she has the money. After approval, go to the Registrar's office to claim your items.";
const isOn = (m) => String(m).startsWith("GCash"),
  isMgr = () => isT() && ["Registrar", "Treasurer"].includes(me().pos);
const notify = (to, text) => {
  if (st(U(to)).notif !== false) S.notes.push({ id: uid(), to, text, at: Date.now() });
};
function notesCard() {
  if (S.view !== "home") return "";
  const L = S.notes
    .filter((n) => n.to === S.me)
    .slice(-5)
    .reverse();
  return L.length
    ? `<section class="card orn" style="margin-bottom:1rem"><h3>🔔 Notifications</h3>${L.map((n) => `<p>${esc(n.text)} <span class="note">${dt(n.at)}</span></p>`).join("")}<button class="btn sm" data-act="clearNotes">Clear</button></section>`
    : "";
}
function payPanel() {
  return `<section class="card orn" style="margin-bottom:1rem"><h3>💳 Payments (visible to the Treasurer only)</h3><p>School GCash received: <b>${peso(S.treasury)}</b> · Payments recorded: ${S.ledger.length}</p>${
    S.ledger.length
      ? `<div class="tw"><table><tr><th>Order</th><th>Student</th><th>Amount</th><th>Method</th><th>Date</th></tr>${S.ledger
          .slice(-8)
          .reverse()
          .map(
            (l) =>
              `<tr><td>${esc(l.no)}</td><td>${esc(U(l.student).name)}</td><td>${peso(l.amount)}</td><td>${esc(l.method)}</td><td>${dt(l.at)}</td></tr>`,
          )
          .join("")}</table></div>`
      : '<p class="note">No payments yet.</p>'
  }</section>`;
}
const myTh = () =>
  S.threads.filter((t) => t.buyer === S.me || t.seller === S.me);
const chatTabs = () => {
  const f = tab("chat", "ann"),
    b = (k, l) => `<button class="btn" aria-pressed="${f === k}" data-act="tab" data-k="chat" data-v="${k}">${l}</button>`;
  return `<div class="tabs">${b("ann", "Announcements")}${b("msg", `Messages (${myTh().length + myDm().filter((d) => d.a === S.me || d.status === "accepted").length})`)}${b("req", `Message requests (${reqIn().length})`)}${b("ppl", "People")}</div>`;
};
function thView() {
  const L = myTh(),
    th = L.find((x) => x.id === tab("th", ""));
  if (!th)
    return `<h2>Messages</h2>${L.length ? L.map((t) => `<button class="card h stat" style="width:100%;margin-bottom:.6rem" data-act="openTh" data-id="${t.id}">🛒 <b style="font-size:1rem">${esc(t.name)}</b><br><span class="note">With ${esc(U(t.buyer === S.me ? t.seller : t.buyer).name)} · ${t.msgs.length} message(s)</span></button>`).join("") : empty("No private chats yet. Buy a second-hand item to start one.")}`;
  const sl = th.seller === S.me,
    o = U(sl ? th.buyer : th.seller);
  return `<div class="row" style="align-items:center"><button class="btn sm" style="flex:0" data-act="openTh" data-id="">← Back</button><h3>${esc(th.name)} · ${peso(th.price)}</h3></div><p class="note">Private chat between you and ${nameLink(o)} (${sl ? "buyer" : "seller"}). Second-hand deals are face to face with no online payment.</p><div class="card" style="margin-bottom:.6rem;border-color:var(--pri)"><b>Status: <span class="badge b-reserved">In order process</span></b><br>${sl ? `<span class="note">Accept after the face-to-face deal is done. Decline to put the item back on sale.</span><br><button class="btn p sm" data-act="dealDone" data-id="${th.id}">✔ Accept (transaction complete)</button> <button class="btn d sm" data-act="dealCancel" data-id="${th.id}">✖ Decline (back on sale)</button>` : `<span class="note">Waiting for the seller to accept or decline.</span><br><button class="btn d sm" data-act="dealCancel" data-id="${th.id}">Cancel my purchase</button>`}</div><section class="card chat orn"><div class="msgs" tabindex="0" aria-label="Messages">${th.msgs.map((m) => `<div class="msg${m.by === S.me ? " me" : ""}"><small><b>${m.by === "sys" ? "Marketplace" : nameLink(U(m.by))}</b> · ${dt(m.at)}</small><div>${esc(m.text)}</div></div>`).join("")}</div><form data-form="dm" data-id="${th.id}" class="row" style="flex-wrap:nowrap;margin-top:.5rem"><input name="text" required aria-label="Message" placeholder="Write a message…"><button class="btn p" style="flex:0">Send</button></form></section>`;
}
const pos = () => (isT() ? me().pos : "");
const queue = (o) =>
  pos() === "Treasurer"
    ? o.status === "pending_payment"
    : pos() === "Registrar"
      ? ["payment_approved", "ready"].includes(o.status)
      : o.status === "pending_payment";
const needPos = (p) => {
  if (!(isT() && me().pos === p)) {
    toast(`Only the ${p} can do this`, "err");
    return false;
  }
  return true;
};
const ord = (id) => S.orders.find((x) => x.id === id),
  dt = (x) => new Date(x).toLocaleString("en-PH");
const payFields = (p) =>
  `<div class="card orn" style="margin:.6rem 0"><b>Payment</b><p class="note">${PAYINFO}</p><p>Your GCash balance: <b>${peso(me().wallet)}</b></p></div><label>Payment method</label><select name="method">${["GCash (online wallet)", "Face to face (cash)"].map((m) => `<option ${p?.method === m ? "selected" : ""}>${m}</option>`).join("")}</select><label>Note (optional)</label><input name="note" value="${esc(p?.note)}"><br>`;
const payForm = (id, p) =>
  `<form data-form="pay" data-id="${id}">${payFields(p)}<button class="btn p">Resubmit payment</button></form>`;
async function payData(f, fd, old) {
  const m = fd.get("method");
  return {
    method: m,
    ref: isOn(m)
      ? "GC-" + Math.random().toString(36).slice(2, 8).toUpperCase()
      : "Face to face",
    note: (fd.get("note") || "").trim(),
    proof: "",
  };
}
const payInfo = (o) =>
  o.pay && (pos() === "Treasurer" || o.student === S.me)
    ? `<div class="note">💳 ${esc(o.pay.method)}${isOn(o.pay.method) ? " · Ref " + esc(o.pay.ref) : ""}${o.pay.note ? " · " + esc(o.pay.note) : ""}${pos() === "Treasurer" && isOn(o.pay.method) ? " · Buyer wallet " + peso(U(o.student).wallet) : ""}</div>`
    : "";
const stCell = (o) =>
  badge(o.status) +
  (o.status === "payment_rejected"
    ? `<div class="note"><b>Reason:</b> ${esc(o.reason)}</div>`
    : "") +
  (o.payBy
    ? `<div class="note">Payment ${o.status === "payment_rejected" ? "rejected" : "approved"} by ${esc(U(o.payBy).name)} (Treasurer) · ${dt(o.payAt)}</div>`
    : "") +
  (o.prepBy
    ? `<div class="note">Prepared by ${esc(U(o.prepBy).name)} · ${dt(o.prepAt)}</div>`
    : "") +
  (o.claimBy
    ? `<div class="note">Released by ${esc(U(o.claimBy).name)} (Registrar) · ${dt(o.claimAt)}</div>`
    : "") +
  (o.status === "payment_approved"
    ? `<div class="note">Awaiting claim: visit the Registrar's office.</div>`
    : o.status === "ready"
      ? `<div class="note">Ready: claim in person at the Registrar's office.</div>`
      : "");
const actCell = (o, t) => {
  const a = actCell0(o, t),
    r =
      ["payment_approved", "ready", "claimed"].includes(o.status) &&
      (!t || ["Registrar", "Treasurer"].includes(pos()))
        ? `<button class="btn sm" data-act="receipt" data-id="${o.id}">View receipt</button>`
        : "";
  return r ? (a.length < 40 ? "" : a) + r : a;
};
const actCell0 = (o, t) => {
  const b = (a, l, c) =>
    `<button class="btn ${c} sm" data-act="${a}" data-id="${o.id}">${l}</button> `;
  if (!t)
    return o.status === "payment_rejected"
      ? b("payRe", "Resubmit payment", "p") + b("ordCancel", "Cancel", "d")
      : o.status === "pending_payment"
        ? b("ordCancel", "Cancel", "d")
        : "—";
  const p = pos();
  if (o.student === S.me)
    return '<span class="note">Your own order: another Treasurer or Registrar must process it.</span>';
  if (p === "Treasurer" && o.status === "pending_payment")
    return (
      b("payOk", "Approve Payment", "p") + b("payNo", "Reject Payment", "d")
    );
  if (p === "Registrar" && o.status === "payment_approved")
    return b("prep", "Mark as Prepared", "p");
  if (p === "Registrar" && o.status === "ready")
    return b("claim", "Mark as Claimed", "p");
  return '<span class="note">—</span>';
};
function ordTable(list, t) {
  if (!list.length) return empty("No orders");
  return `<div class="tw"><table><thead><tr><th>#</th>${t ? "<th>Student</th>" : ""}<th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list
    .slice()
    .reverse()
    .map(
      (o) =>
        `<tr><td>${o.no}</td>${t ? `<td>${esc(U(o.student).name)}<br><span class="note">${esc(U(o.student).grade || "")} ${esc(U(o.student).block || "")}</span></td>` : ""}<td>${o.items.map((i) => `${esc(i.name)}${i.size ? ` (${i.size})` : ""} × ${i.qty}`).join("<br>")}${payInfo(o)}</td><td>${peso(o.total)}</td><td>${new Date(o.at).toLocaleDateString("en-PH")}</td><td>${stCell(o)}</td><td>${actCell(o, t)}</td></tr>`,
    )
    .join("")}</tbody></table></div>`;
}
function profileView() {
  const u = me(),
    t = u.role === "teacher";
  return `<h2>Profile</h2><section class="card orn row" style="align-items:center"><div class="av" style="flex:0 0 72px">${avInner(u)}</div><div style="flex:3"><h3 class="serif">${esc(u.name)}</h3><p class="note">${esc(u.email || "Demo account")}${u.gender ? " · " + esc(u.gender) : ""}${u.age ? " · " + esc(u.age) + " yrs old" : ""}</p>${t ? `<p>School role: <b>${esc(u.pos)}</b></p>` : `<p>${esc(u.level)} · ${esc(u.grade)} · ${esc(u.block)}${u.strand ? ` · ${esc(u.strand)}` : ""}</p>`}${`<p>💳 GCash balance: <b>${peso(u.wallet)}</b> (demo wallet)</p>`}<p class="note">☎ ${esc(u.phone || "none")}</p><button class="btn" data-act="profForm">Edit profile</button> <button class="btn" data-act="nav" data-v="settings">⚙️ Settings</button></div></section>`;
}
function cartDlg() {
  const c = S.cart[S.me] || {},
    ks = Object.keys(c);
  let tot = 0;
  openModal(
    "🛒 Your Cart",
    ks.length
      ? `<div class="tw"><table>${ks
          .map((k) => {
            const i = c[k],
              p = P(i.pid);
            if (!p) return "";
            const l = i.qty * unit(p, i.size);
            tot += l;
            return `<tr><td>${esc(p.name)}${i.size ? ` (${i.size})` : ""}<br><span class="note">${peso(unit(p, i.size))}</span></td><td><input type="number" min="1" value="${i.qty}" data-act="cq" data-k="${k}" aria-label="Quantity" style="width:70px"></td><td>${peso(l)}</td><td><button class="btn sm d" data-act="crm" data-k="${k}" title="Remove">✕</button></td></tr>`;
          })
          .join(
            "",
          )}</table></div><p class="price">Total: ${peso(tot)}</p><p class="note">Stock is checked again when you submit.</p><form data-form="checkout">${payFields()}<button class="btn p">Place order</button></form>`
      : empty("Your cart is empty"),
  );
}
const A = {
  openTh: (d) => {
    S.tab.th = d.id;
    render();
  },
  clearNotes: () => {
    S.notes = S.notes.filter((n) => n.to !== S.me);
    save();
    render();
  },
  receipt: (d) => {
    const o = ord(d.id);
    if (
      !o ||
      !["payment_approved", "ready", "claimed"].includes(o.status) ||
      !(o.student === S.me || ["Registrar", "Treasurer"].includes(me().pos))
    )
      return;
    const s = U(o.student);
    openModal(
      "Order receipt",
      `<div class="card orn"><p><b>${esc(o.no)}</b> · ${esc(s.name)} (${esc(s.grade || "")} ${esc(s.block || "")})</p><table>${o.items.map((i) => `<tr><td>${esc(i.name)}${i.size ? " (" + i.size + ")" : ""} × ${i.qty}</td><td>${peso(i.price * i.qty)}</td></tr>`).join("")}<tr><th>Total paid</th><th>${peso(o.total)}</th></tr></table><p class="note">Payment: ${esc(o.pay.method)} · verified by ${esc(U(o.payBy).name)} (Treasurer) on ${dt(o.payAt)}</p><p><b>Status:</b> ${esc(LBL[o.status])}</p><p class="note">The student claims this order in person at the Registrar's office.</p></div>`,
    );
  },
  buy: (d) => {
    const l = S.listings.find((x) => x.id === d.id);
    if (!l || l.status !== "live")
      return toast("This item is no longer available", "err");
    if (l.owner === S.me) return toast("This is your own listing", "err");
    l.status = "reserved";
    const th = {
      id: uid(),
      lid: l.id,
      name: l.name,
      price: l.price,
      buyer: S.me,
      seller: l.owner,
      msgs: [
        {
          id: uid(),
          by: "sys",
          text: `${me().name} wants to buy "${l.name}" (${peso(l.price)}). Arrange a face-to-face meetup and payment here.`,
          at: Date.now(),
        },
      ],
    };
    S.threads.push(th);
    notify(
      l.owner,
      `${me().name} wants to buy your "${l.name}". Open Chat, then Messages.`,
    );
    S.view = "chat";
    S.tab.chat = "msg";
    S.tab.th = th.id;
    S.tab.dm = "";
    save();
    render();
    toast("Private chat opened with the seller");
  },
  dealDone: async (d) => {
    const th = S.threads.find((x) => x.id === d.id);
    if (!th || th.seller !== S.me)
      return toast("Only the seller can confirm the sale", "err");
    if (
      !(await confirmDlg(
        "Accept and complete this sale? The item will disappear from the store and this chat will be removed. This cannot be undone.",
      ))
    )
      return;
    const l = S.listings.find((x) => x.id === th.lid);
    if (l) l.status = "sold";
    notify(th.buyer, `Your purchase of "${th.name}" is complete.`);
    S.threads = S.threads.filter((x) => x.id !== th.id);
    S.tab.th = "";
    save();
    render();
    toast("Sold: listing and chat removed");
  },
  dealCancel: async (d) => {
    const th = S.threads.find((x) => x.id === d.id);
    if (!th || (th.buyer !== S.me && th.seller !== S.me)) return;
    if (
      !(await confirmDlg(
        th.seller === S.me
          ? "Decline this buyer? The item goes back on sale and this chat is deleted."
          : "Cancel your purchase? The item goes back on sale and this chat is deleted.",
      ))
    )
      return;
    const l = S.listings.find((x) => x.id === th.lid);
    if (l) l.status = "live";
    notify(
      S.me === th.buyer ? th.seller : th.buyer,
      `${th.seller === S.me ? "The seller declined" : "The buyer cancelled"} the deal for "${th.name}". It is back on sale.`,
    );
    S.threads = S.threads.filter((x) => x.id !== th.id);
    S.tab.th = "";
    save();
    render();
    toast("Done: item is back on sale");
  },
  auth: (d) => {
    authMode = d.v;
    render();
  },
  goSh: () => {
    S.tab.shop = "sh";
    S.view = "shop";
    save();
    render();
  },
  close: closeModal,
  login: (d) => {
    S.me = d.id;
    S.view = "home";
    save();
    render();
  },
  logout: () => {
    S.me = null;
    save();
    render();
  },
  reset: async () => {
    if (
      !(await confirmDlg(
        "Reset demo products, events and orders? Registered accounts are kept.",
      ))
    )
      return;
    const keep = S.users.filter((u) => u.hash);
    S = seed();
    S.users.push(...keep);
    ensureAdmin();
    save();
    render();
    toast("Demo data reset");
  },
  nav: (d) => {
    S.view = d.v;
    save();
    render();
  },
  tab: (d) => {
    S.tab[d.k] = d.v;
    render();
  },
  pick: (d) => {
    picks[d.id] = d.z;
    render();
  },
  add: (d) => {
    const p = P(d.id),
      q = Math.max(1, parseInt($("#q_" + d.id).value) || 1),
      z = p.sizes ? picks[d.id] : "";
    if (p.sizes && !z) return toast("Select an available size first", "err");
    const c = (S.cart[S.me] = S.cart[S.me] || {}),
      k = d.id + "|" + z,
      have = c[k]?.qty || 0;
    if (have + q > stock(p, z))
      return toast(
        `Only ${stock(p, z)} available${have ? ` (${have} already in cart)` : ""}`,
        "err",
      );
    c[k] = { pid: d.id, size: z, qty: have + q };
    save();
    render();
    toast("Added to cart");
  },
  cart: cartDlg,
  cq: (d, b) => {
    const c = S.cart[S.me][d.k],
      p = P(c.pid),
      q = parseInt(b.value) || 1;
    if (q > stock(p, c.size)) {
      toast("Exceeds stock", "err");
      b.value = c.qty;
      return;
    }
    c.qty = q;
    save();
    cartDlg();
    render();
  },
  crm: (d) => {
    delete S.cart[S.me][d.k];
    save();
    cartDlg();
    render();
  },

  payOk: (d) => {
    if (!needPos("Treasurer")) return;
    const o = ord(d.id);
    if (o.student === S.me)
      return toast(
        "You cannot process your own order: another staff member in that role must do it",
        "err",
      );
    if (o.status !== "pending_payment") return toast("Already decided", "err");
    for (const i of o.items) {
      const p = P(i.pid);
      if (!p || stock(p, i.size) < i.qty)
        return toast(
          `Insufficient stock for ${i.name}${i.size ? " (" + i.size + ")" : ""}: reject with a reason instead`,
          "err",
        );
    }
    const buyer = U(o.student),
      on = isOn(o.pay.method);
    if (on && (buyer.wallet || 0) < o.total)
      return toast(
        "The buyer has too little GCash balance: reject this payment",
        "err",
      );
    o.items.forEach((i) => {
      const p = P(i.pid);
      p.sizes ? (p.sizes[i.size].q -= i.qty) : (p.qty -= i.qty);
    });
    if (on) {
      buyer.wallet -= o.total;
      S.treasury += o.total;
    }
    S.ledger.push({
      id: uid(),
      no: o.no,
      student: o.student,
      amount: o.total,
      method: o.pay.method,
      at: Date.now(),
      by: S.me,
    });
    Object.assign(o, {
      status: "payment_approved",
      payBy: S.me,
      payAt: Date.now(),
      reason: "",
    });
    notify(
      o.student,
      `Order ${o.no} was granted (payment approved). Go to the Registrar's office to claim your items.`,
    );
    S.users
      .filter((u) => u.pos === "Registrar")
      .forEach((u) =>
        notify(
          u.id,
          `Order ${o.no} is paid. Receipt is ready: prepare the items for ${U(o.student).name}.`,
        ),
      );
    save();
    render();
    toast("Payment approved — awaiting claim");
  },
  payNo: (d) => {
    if (!needPos("Treasurer")) return;
    const o = ord(d.id);
    if (o.student === S.me)
      return toast(
        "You cannot process your own order: another staff member in that role must do it",
        "err",
      );
    if (o.status !== "pending_payment") return toast("Already decided", "err");
    openModal(
      "Reject payment",
      `<form data-form="rej" data-id="${o.id}"><label>Reason (shown to the student)</label><textarea name="reason" rows="3" required maxlength="300"></textarea><br><button class="btn d">Reject payment</button></form>`,
    );
  },
  payRe: (d) => {
    const o = ord(d.id);
    if (o.student !== S.me || o.status !== "payment_rejected") return;
    openModal("Resubmit payment", payForm(o.id, o.pay));
  },
  prep: (d) => {
    if (!needPos("Registrar")) return;
    const o = ord(d.id);
    if (o.student === S.me)
      return toast(
        "You cannot process your own order: another staff member in that role must do it",
        "err",
      );
    if (o.status !== "payment_approved")
      return toast("Payment must be approved by the Treasurer first", "err");
    Object.assign(o, { status: "ready", prepBy: S.me, prepAt: Date.now() });
    save();
    render();
    toast("Order is ready for claiming");
  },
  claim: async (d) => {
    if (!needPos("Registrar")) return;
    const o = ord(d.id);
    if (o.student === S.me)
      return toast(
        "You cannot process your own order: another staff member in that role must do it",
        "err",
      );
    if (o.status !== "ready")
      return toast("Order must be prepared first", "err");
    if (
      !(await confirmDlg(
        `Confirm that ${U(o.student).name} is physically here and has received the products.`,
      ))
    )
      return;
    Object.assign(o, { status: "claimed", claimBy: S.me, claimAt: Date.now() });
    save();
    render();
    toast("Order completed / claimed");
  },
  ordCancel: async (d) => {
    const o = S.orders.find((x) => x.id === d.id);
    if (
      o.student !== S.me ||
      !["pending_payment", "payment_rejected"].includes(o.status)
    )
      return;
    if (await confirmDlg("Cancel this order?")) {
      o.status = "cancelled";
      save();
      render();
    }
  },
  subDec: async (d) => {
    if (!guard("mgr")) return;
    const s = S.subs.find((x) => x.id === d.id);
    if (s.status !== "pending") return toast("Already decided", "err");
    if (
      d.s === "declined" &&
      !(await confirmDlg(
        "Decline this submission? It will never be published.",
      ))
    )
      return;
    s.status = d.s;
    save();
    render();
    toast("Submission " + d.s);
  },
  post: (d) => {
    if (!guard("mgr")) return;
    const s = S.subs.find((x) => x.id === d.id);
    if (s.status !== "approved") return;
    S.listings.push({ ...s, id: uid(), subId: s.id, status: "live" });
    s.status = "posted";
    save();
    render();
    toast("Posted to the Second-Hand Store");
  },
  lst: (d) => {
    if (!guard("mgr")) return;
    const l = S.listings.find((x) => x.id === d.id);
    if (l.status === "reserved" && S.threads.some((t) => t.lid === l.id))
      return toast("A buyer chat is open for this item", "err");
    l.status = d.s;
    save();
    render();
  },
  lstEdit: (d) => {
    const l = S.listings.find((x) => x.id === d.id);
    openModal(
      "Edit listing",
      `<form data-form="lst" data-id="${l.id}"><label>Name</label><input name="name" value="${esc(l.name)}" required><label>Price (₱)</label><input name="price" type="number" min="1" step="0.01" value="${l.price}" required><label>Quantity</label><input name="qty" type="number" min="0" value="${l.qty}"><br><button class="btn p">Save</button></form>`,
    );
  },
  annForm: () =>
    openModal(
      "New announcement",
      `<form data-form="ann"><textarea name="text" rows="3" required></textarea><br><button class="btn p">Publish</button></form>`,
    ),
  prodForm: (d) => {
    const p = S.products.find((x) => x.id === d.id) || { sizes: null, qty: 0 },
      has = !!p.sizes;
    openModal(
      p.id ? "Edit product" : "Add product",
      `<form data-form="prod" data-id="${p.id || ""}"><label>Name</label><input name="name" required value="${esc(p.name)}"><div class="row"><div><label>Category</label><select name="cat">${["Uniform", "Books", "School Supplies", "Other"].map((c) => `<option ${p.cat === c ? "selected" : ""}>${c}</option>`).join("")}</select></div><div><label>Base price (₱)</label><input name="price" type="number" min="0" step="0.01" required value="${p.price || ""}"></div></div><label>Description</label><textarea name="desc" rows="2">${esc(p.desc)}</textarea>
 <label><input type="checkbox" name="hasSizes" ${has ? "checked" : ""} onchange="document.getElementById('szb').hidden=!this.checked;document.getElementById('qb').hidden=this.checked"> Has sizes (clothing)</label>
 <div id="szb" ${has ? "" : "hidden"}><p class="note">Stock per size (blank size price = base price). 0 = out of stock.</p>${SIZES.map((z) => `<div class="row" style="align-items:center"><b style="flex:0 0 44px">${z}</b><input type="number" min="0" name="q_${z}" placeholder="stock" aria-label="${z} stock" value="${p.sizes?.[z]?.q ?? ""}"><input type="number" min="0" step="0.01" name="p_${z}" placeholder="price" aria-label="${z} price" value="${p.sizes?.[z]?.price ?? ""}"></div>`).join("")}</div>
 <div id="qb" ${has ? "hidden" : ""}><label>Quantity</label><input type="number" min="0" name="qty" value="${p.qty || 0}"></div><label>Image</label><input type="file" name="img" accept="image/*"><br><button class="btn p">Save</button></form>`,
    );
  },
  prodDel: async (d) => {
    if (!guard("mgr")) return;
    const p = P(d.id);
    if (
      await confirmDlg(
        `Remove "${p.name}"? Pending orders for it can no longer be approved.`,
      )
    ) {
      S.products = S.products.filter((x) => x.id !== d.id);
      save();
      render();
      toast("Product removed");
    }
  },
  profForm: () => {
    const u = me();
    openModal(
      "Edit profile",
      `<form data-form="prof"><label>Full name</label><input name="name" required value="${esc(u.name)}"><label>Phone</label><input name="phone" value="${esc(u.phone)}"><div class="row"><div><label>Gender</label><select name="gender">${["Male", "Female", "Prefer not to say"].map((x) => `<option ${u.gender === x ? "selected" : ""}>${x}</option>`).join("")}</select></div><div><label>Age</label><input name="age" type="number" min="10" max="99" value="${esc(u.age)}"></div></div>${u.role === "student" ? `<div class="row"><div><label>Grade / Year</label><input name="grade" value="${esc(u.grade)}"></div><div><label>Block</label><input name="block" value="${esc(u.block)}"></div><div><label>Strand / Course</label><input name="strand" value="${esc(u.strand)}"></div></div>` : ""}<br><button class="btn p">Save</button></form>`,
    );
  },
};
// ---- Administrator: accounts page, delete accounts, change admin password ----
const roleLabel = (u) =>
  u.role === "admin" ? "Admin" : u.role === "teacher" ? `Teacher (${u.pos})` : "Student";
const schoolInfo = (u) =>
  u.role === "student" ? [u.level, u.grade, u.block, u.strand].filter(Boolean).join(" · ") : u.role === "teacher" ? u.pos : "—";
const accountKind = (u) => (u.role === "admin" ? "Built-in" : u.hash ? "Registered" : "Demo");

// Remove an account and everything that belongs to it.
function removeUser(id) {
  // Items another person was buying from this user go back on sale.
  S.threads
    .filter((t) => t.buyer === id || t.seller === id)
    .forEach((t) => {
      const l = S.listings.find((x) => x.id === t.lid);
      if (l && l.status === "reserved") l.status = "live";
    });
  S.threads = S.threads.filter((t) => t.buyer !== id && t.seller !== id);
  S.dms = S.dms.filter((d) => d.a !== id && d.b !== id);
  S.users.forEach((x) => { if (x.blocked) x.blocked = x.blocked.filter((b) => b !== id); });
  S.listings = S.listings.filter((l) => l.owner !== id);
  S.subs = S.subs.filter((s) => s.owner !== id);
  S.orders = S.orders.filter((o) => o.student !== id);
  S.notes = S.notes.filter((n) => n.to !== id);
  delete S.cart[id];
  S.users = S.users.filter((u) => u.id !== id);
}

Object.assign(V, {
  a_accounts: () => {
    const f = tab("acc", "all"),
      cnt = {
        all: S.users.length,
        student: S.users.filter((u) => u.role === "student").length,
        teacher: S.users.filter((u) => u.role === "teacher").length,
        admin: S.users.filter((u) => u.role === "admin").length,
      },
      list = S.users.filter((u) => f === "all" || u.role === f);
    return `<h2>Accounts (${cnt.all})</h2><p class="note">Only the administrator can see this page. Passwords are never shown.</p>
 <div class="tabs">${[["all", "All"], ["student", "Students"], ["teacher", "Teachers"], ["admin", "Admin"]]
   .map(([k, l]) => `<button class="btn" aria-pressed="${f === k}" data-act="tab" data-k="acc" data-v="${k}">${l} (${cnt[k]})</button>`)
   .join("")}<button class="btn p" style="margin-left:auto" data-act="adminPw">Change my password</button></div>
 <div class="tw"><table><thead><tr><th>Name</th><th>Email</th><th>Type</th><th>School info</th><th>Gender / Age</th><th>Phone</th><th>GCash</th><th>Account</th><th>Action</th></tr></thead><tbody>${
   list
     .map(
       (u) =>
         `<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email || "— (demo account)")}</td><td>${esc(roleLabel(u))}</td><td>${esc(schoolInfo(u))}</td><td>${esc(u.gender || "—")}${u.age ? " · " + esc(u.age) : ""}</td><td>${esc(u.phone || "—")}</td><td>${u.role === "admin" ? "—" : peso(u.wallet)}</td><td>${accountKind(u)}</td><td>${u.id === S.me ? '<span class="note">You</span>' : `<button class="btn d sm" data-act="delUser" data-id="${u.id}">Delete</button>`}</td></tr>`,
     )
     .join("") || `<tr><td colspan="9">${empty("No accounts")}</td></tr>`
 }</tbody></table></div>`;
  },
});

Object.assign(A, {
  delUser: async (d) => {
    if (!isAdmin()) return toast("Only the administrator can delete accounts", "err");
    const u = S.users.find((x) => x.id === d.id);
    if (!u || u.id === S.me) return toast("You cannot delete your own account", "err");
    if (u.role === "admin" && S.users.filter((x) => x.role === "admin").length < 2)
      return toast("The last administrator cannot be deleted", "err");
    if (!(await confirmDlg(`Delete ${u.name} (${u.email || "demo account"})? Their orders, listings, chats and notifications are removed too. This cannot be undone.`))) return;
    removeUser(u.id);
    save();
    render();
    toast(`Deleted ${u.name}`);
  },
  adminPw: () => {
    if (!isAdmin()) return;
    openModal(
      "Change administrator password",
      `<form data-form="adminpw"><label>Current password</label><input name="current" type="password" required autocomplete="current-password"><label>New password (at least 6 characters)</label><input name="next" type="password" minlength="6" required autocomplete="new-password"><label>Repeat new password</label><input name="again" type="password" minlength="6" required autocomplete="new-password"><br><button class="btn p">Save password</button></form>`,
    );
  },
});

// ======================= People, direct messages, profiles & settings =======================
const DEFAULT_SET = { showEmail: false, showPhone: false, showAge: true, showGender: true, allowDm: "everyone", notif: true, theme: "system", size: "normal" };
const st = (u) => ({ ...DEFAULT_SET, ...((u && u.set) || {}) });
const roleIcon = (u) => (u.role === "teacher" ? "🎓" : u.role === "admin" ? "🛡️" : "🎒");
const avInner = (u) => (u.avatar ? `<img src="${esc(u.avatar)}" alt="">` : roleIcon(u));
const avSm = (u) => `<span class="avs">${avInner(u)}</span>`;
// A name that opens that person's profile when clicked.
const nameLink = (u, av = true) =>
  u && u.id ? `<button type="button" class="link" data-act="viewProfile" data-id="${u.id}">${av ? avSm(u) : ""}${esc(u.name)}</button>` : esc((u && u.name) || "Unknown");
const myDm = () => S.dms.filter((d) => d.a === S.me || d.b === S.me);
const reqIn = () => myDm().filter((d) => d.b === S.me && d.status === "request" && d.msgs.length);
const chatCount = () => myTh().length + reqIn().length;
const isBlocked = (a, b) => ((U(a).blocked || []).includes(b)) || ((U(b).blocked || []).includes(a));
// May `a` message `b`? (not blocked, not the admin, and b accepts messages)
function canMsg(a, b, dm) {
  const t = S.users.find((x) => x.id === b);
  if (!t || t.role === "admin" || a === b || isBlocked(a, b)) return false;
  return st(t).allowDm !== "none" || !!(dm && dm.status === "accepted");
}
// Apply the signed-in user's theme and text size.
function applyPrefs() {
  const s = S.me ? st(me()) : DEFAULT_SET, r = document.documentElement;
  if (s.theme === "light" || s.theme === "dark") r.dataset.theme = s.theme;
  else delete r.dataset.theme;
  document.body.style.fontSize = { normal: "", large: "17px", xl: "19px" }[s.size] || "";
}
// Crop to a centred square and shrink, so profile pictures stay small in storage.
function resizeImg(file, max = 160) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = () => rej("Could not read that image");
    r.onload = () => {
      const img = new Image();
      img.onerror = () => rej("That file is not a valid image");
      img.onload = () => {
        const s = Math.min(img.width, img.height), c = document.createElement("canvas");
        c.width = c.height = max;
        c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, max, max);
        res(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
const preview = (t, n) => (t.length > n ? t.slice(0, n) + "…" : t);
const personCard = (u) =>
  `<div class="card h"><div style="display:flex;gap:.6rem;align-items:center"><div class="av" style="width:48px;height:48px;font-size:1.3rem;flex:none">${avInner(u)}</div><div><b>${nameLink(u, false)}</b><br><span class="note">${esc(roleLabel(u))}${u.role === "student" ? " · " + esc(schoolInfo(u)) : ""}</span></div></div><div style="margin-top:.6rem"><button class="btn sm" data-act="viewProfile" data-id="${u.id}">View profile</button> <button class="btn p sm" data-act="startDm" data-id="${u.id}">Message</button></div></div>`;
function peopleList(q) {
  q = (q || "").trim().toLowerCase();
  const L = S.users
    .filter((u) => u.id !== S.me && u.role !== "admin" && !isBlocked(S.me, u.id))
    .filter((u) => !q || [u.name, roleLabel(u), u.role === "student" ? schoolInfo(u) : ""].join(" ").toLowerCase().includes(q) || u.email === q)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 30);
  return L.map(personCard).join("") || empty("No accounts found");
}
function pplView() {
  return `<h2>People</h2><p class="note">Search existing accounts by name, role or section (or an exact email). Open a profile or send a message request.</p><input id="pq" type="search" placeholder="Search people…" aria-label="Search people" autocomplete="off"><div id="pres" class="grid" style="margin-top:1rem">${peopleList("")}</div>`;
}
function reqView() {
  const L = reqIn();
  return `<h2>Message requests</h2><p class="note">People who are not in your chats yet. Accept to start chatting, or decline.</p>${
    L.length
      ? L.map((d) => {
          const s = U(d.a), last = d.msgs[d.msgs.length - 1];
          return `<div class="card h" style="margin-bottom:.6rem"><div style="display:flex;gap:.6rem;align-items:center"><div class="av" style="width:48px;height:48px;font-size:1.3rem;flex:none">${avInner(s)}</div><div style="flex:1"><b>${nameLink(s, false)}</b><br><span class="note">${esc(preview(last.text, 80))}</span></div></div><div style="margin-top:.6rem"><button class="btn sm" data-act="openDm" data-id="${d.id}">Open</button> <button class="btn p sm" data-act="dmAccept" data-id="${d.id}">Accept</button> <button class="btn d sm" data-act="dmDecline" data-id="${d.id}">Decline</button></div></div>`;
        }).join("")
      : empty("No message requests")
  }`;
}
function dmView(d) {
  const mine = d.a === S.me, o = U(mine ? d.b : d.a), pend = d.status === "request", sent = d.msgs.some((m) => m.by === S.me);
  const ok = canMsg(S.me, o.id, d), wait = pend && mine && sent;
  return `<div class="row" style="align-items:center"><button class="btn sm" style="flex:0" data-act="openDm" data-id="">← Back</button><h3>${nameLink(o)}</h3></div>${
    pend && !mine ? `<div class="card" style="margin-bottom:.6rem;border-color:var(--pri)"><b>${esc(o.name)}</b> wants to message you. <button class="btn p sm" data-act="dmAccept" data-id="${d.id}">Accept</button> <button class="btn d sm" data-act="dmDecline" data-id="${d.id}">Decline</button><br><span class="note">Replying also accepts the request.</span></div>` : ""
  }${pend && mine ? '<p class="note">Message request: you can send one message until they accept.</p>' : ""}<section class="card chat orn"><div class="msgs" tabindex="0" aria-label="Messages">${
    d.msgs.map((m) => `<div class="msg${m.by === S.me ? " me" : ""}"><small><b>${nameLink(U(m.by))}</b> · ${dt(m.at)}</small><div>${esc(m.text)}</div></div>`).join("") || '<p class="note">No messages yet. Say hello!</p>'
  }</div>${
    ok && !wait ? `<form data-form="dmsg" data-id="${d.id}" class="row" style="flex-wrap:nowrap;margin-top:.5rem"><input name="text" required aria-label="Message" placeholder="Write a message…" maxlength="500"><button class="btn p" style="flex:0">Send</button></form>` : `<p class="note">${wait ? "Waiting for them to accept your request." : "You can't send messages in this chat."}</p>`
  }</section>`;
}
function msgView() {
  const dm = myDm().find((x) => x.id === tab("dm", ""));
  if (dm) return dmView(dm);
  if (myTh().some((x) => x.id === tab("th", ""))) return thView();
  const D = myDm().filter((x) => x.a === S.me || x.status === "accepted").sort((a, b) => (b.at || 0) - (a.at || 0));
  const rows =
    D.map((d) => {
      const o = U(d.a === S.me ? d.b : d.a), last = d.msgs[d.msgs.length - 1];
      return `<button class="card h stat" style="width:100%;margin-bottom:.6rem" data-act="openDm" data-id="${d.id}"><div style="display:flex;gap:.6rem;align-items:center"><div class="av" style="width:40px;height:40px;font-size:1.1rem;flex:none">${avInner(o)}</div><div><b style="font-size:1rem">${esc(o.name)}</b>${d.status === "request" ? ' <span class="badge b-pending">Request sent</span>' : ""}<br><span class="note">${last ? esc(preview(last.text, 60)) : "No messages yet"}</span></div></div></button>`;
    }).join("") +
    myTh().map((t) => `<button class="card h stat" style="width:100%;margin-bottom:.6rem" data-act="openTh" data-id="${t.id}">🛒 <b style="font-size:1rem">${esc(t.name)}</b><br><span class="note">Second-hand deal with ${esc(U(t.buyer === S.me ? t.seller : t.buyer).name)} · ${t.msgs.length} message(s)</span></button>`).join("");
  return `<h2>Messages</h2>${rows || empty("No chats yet. Use People to message someone, or buy a second-hand item.")}`;
}
function settingsView() {
  const u = me(), s = st(u), reg = !!u.hash, blocked = (u.blocked || []).map(U);
  const cb = (n, t) => `<label style="font-weight:400"><input type="checkbox" name="${n}" ${s[n] ? "checked" : ""}> ${t}</label>`;
  const sel = (n, o) => `<select name="${n}">${o.map(([v, l]) => `<option value="${v}" ${s[n] === v ? "selected" : ""}>${l}</option>`).join("")}</select>`;
  const sec = (t, b) => `<section class="card" style="margin-bottom:1rem"><h3>${t}</h3>${b}</section>`;
  const pwf = (n) => `<label>${n}</label><input name="${n === "Current password" ? "current" : n === "New password (at least 6 characters)" ? "next" : "again"}" type="password" required ${n.startsWith("Current") ? 'autocomplete="current-password"' : 'minlength="6" autocomplete="new-password"'}>`;
  return `<h2>Settings</h2>` +
    sec("🖼️ Profile picture", `<div class="row" style="align-items:center"><div class="av" style="flex:0 0 72px">${avInner(u)}</div><div style="flex:3"><input type="file" accept="image/*" data-act="avatarUp" aria-label="Upload profile picture"><p class="note">Pick any photo. It is cropped to a square and shrunk to save space.</p>${u.avatar ? '<button class="btn sm d" data-act="avatarDel">Remove photo</button>' : ""}</div></div>`) +
    sec("🔒 Privacy", `<form data-form="priv"><p class="note">Your name, photo, role and school info are always visible when someone opens your profile. Choose what else to show.</p>${cb("showEmail", "Show my email")}${cb("showPhone", "Show my contact number")}${cb("showAge", "Show my age")}${cb("showGender", "Show my gender")}<label>Who can send me message requests</label>${sel("allowDm", [["everyone", "Everyone"], ["none", "Nobody"]])}<br><button class="btn p">Save privacy</button></form><h4>Blocked people</h4>${blocked.length ? blocked.map((b) => `<p>${esc(b.name)} <button class="btn sm" data-act="unblockUser" data-id="${b.id}">Unblock</button></p>`).join("") : '<p class="note">You have not blocked anyone.</p>'}`) +
    sec("🔔 Notifications & appearance", `<form data-form="prefs">${cb("notif", "Show in-app notifications (orders, deals, message requests)")}<label>Theme</label>${sel("theme", [["system", "Match my device"], ["light", "Light"], ["dark", "Dark"]])}<label>Text size</label>${sel("size", [["normal", "Normal"], ["large", "Large"], ["xl", "Extra large"]])}<br><button class="btn p">Save</button> <button type="button" class="btn" data-act="clearNotes">Clear my notifications</button></form>`) +
    sec("👤 Account", reg
      ? `<form data-form="email"><label>Email</label><input name="email" type="email" required value="${esc(u.email)}">${pwf("Current password")}<br><button class="btn p">Update email</button></form><hr><form data-form="pw">${pwf("Current password")}${pwf("New password (at least 6 characters)")}${pwf("Repeat new password")}<br><button class="btn p">Change password</button></form><hr><button class="btn" data-act="dlData">⬇ Download my data</button><hr><form data-form="delme"><p class="note"><b>Delete account.</b> Permanently removes your account, orders, listings, chats and notifications.</p>${pwf("Current password")}<br><button class="btn d">Delete my account</button></form>`
      : `<p class="note">This is a demo account with no email or password. Register your own account to change these settings.</p><button class="btn" data-act="dlData">⬇ Download my data</button>`);
}
Object.assign(V, { t_settings: settingsView, s_settings: settingsView });
Object.assign(A, {
  viewProfile: (d) => {
    const t = S.users.find((x) => x.id === d.id);
    if (!t || (t.role === "admin" && !isAdmin())) return;
    const s = st(t), self = t.id === S.me, bits = [s.showGender && t.gender, s.showAge && t.age && t.age + " yrs"].filter(Boolean).join(" · ");
    openModal("Profile", `<div class="row" style="align-items:center"><div class="av" style="flex:0 0 72px">${avInner(t)}</div><div style="flex:3"><h3 class="serif" style="margin:0">${esc(t.name)}</h3><p class="note" style="margin:.2rem 0">${esc(roleLabel(t))}</p>${t.role === "student" ? `<p style="margin:.2rem 0">${esc(schoolInfo(t))}</p>` : ""}${bits ? `<p class="note">${esc(bits)}</p>` : ""}${s.showEmail && t.email ? `<p class="note">✉ ${esc(t.email)}</p>` : ""}${s.showPhone && t.phone ? `<p class="note">☎ ${esc(t.phone)}</p>` : ""}</div></div>` +
      (self ? `<p><button class="btn" data-act="goSettings">⚙️ Edit in Settings</button></p>` : isAdmin() ? "" : `<p><button class="btn p" data-act="startDm" data-id="${t.id}">💬 Message</button> ${(me().blocked || []).includes(t.id) ? `<button class="btn" data-act="unblockUser" data-id="${t.id}">Unblock</button>` : `<button class="btn d" data-act="blockUser" data-id="${t.id}">Block</button>`}</p>`));
  },
  goSettings: () => { if ($("#dlg").open) closeModal(); S.view = "settings"; save(); render(); },
  startDm: (d) => {
    if (!S.me || isAdmin() || d.id === S.me) return;
    if (!canMsg(S.me, d.id)) return toast("You can't message this person", "err");
    let dm = S.dms.find((x) => (x.a === S.me && x.b === d.id) || (x.a === d.id && x.b === S.me));
    if (!dm) { dm = { id: uid(), a: S.me, b: d.id, status: "request", msgs: [], at: Date.now() }; S.dms.push(dm); }
    if ($("#dlg").open) closeModal();
    S.view = "chat"; S.tab.chat = "msg"; S.tab.dm = dm.id; S.tab.th = "";
    save(); render();
  },
  openDm: (d) => { S.tab.dm = d.id; if (d.id) { S.tab.chat = "msg"; S.tab.th = ""; } render(); },
  dmAccept: (d) => {
    const x = S.dms.find((y) => y.id === d.id);
    if (!x || x.b !== S.me) return;
    x.status = "accepted"; notify(x.a, `${me().name} accepted your message request.`);
    S.tab.dm = x.id; S.tab.chat = "msg"; save(); render(); toast("Request accepted");
  },
  dmDecline: async (d) => {
    const x = S.dms.find((y) => y.id === d.id);
    if (!x || x.b !== S.me) return;
    if (!(await confirmDlg("Decline this message request? The conversation is deleted."))) return;
    S.dms = S.dms.filter((y) => y.id !== x.id); S.tab.dm = ""; save(); render(); toast("Request declined");
  },
  blockUser: async (d) => {
    if (!(await confirmDlg("Block this person? They can't message you, and your chat with them is deleted."))) return;
    const u = me();
    u.blocked = [...new Set([...(u.blocked || []), d.id])];
    S.dms = S.dms.filter((x) => !((x.a === S.me && x.b === d.id) || (x.a === d.id && x.b === S.me)));
    S.tab.dm = ""; save(); if ($("#dlg").open) closeModal(); render(); toast("Blocked");
  },
  unblockUser: (d) => { const u = me(); u.blocked = (u.blocked || []).filter((x) => x !== d.id); save(); if ($("#dlg").open) closeModal(); render(); toast("Unblocked"); },
  avatarUp: async (d, b) => {
    const f = b.files && b.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast("Please choose an image file", "err");
    if (f.size > 8e6) return toast("That image is too large (max 8 MB)", "err");
    try { me().avatar = await resizeImg(f); save(); render(); toast("Profile picture updated"); } catch (e) { toast(String(e), "err"); }
  },
  avatarDel: () => { delete me().avatar; save(); render(); toast("Profile picture removed"); },
  dlData: () => {
    const { hash: _h, salt: _s, ...pub } = me();
    const data = { account: pub, orders: S.orders.filter((o) => o.student === S.me), listings: S.listings.filter((l) => l.owner === S.me), requests: S.subs.filter((s) => s.owner === S.me), notifications: S.notes.filter((n) => n.to === S.me) };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = "my-cctc-mart-data.json"; a.click(); URL.revokeObjectURL(a.href);
  },
});
document.addEventListener("input", (e) => { if (e.target.id === "pq") $("#pres").innerHTML = peopleList(e.target.value); });

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (b && b.tagName !== "INPUT" && A[b.dataset.act])
    A[b.dataset.act](b.dataset, b);
});
document.addEventListener("change", (e) => {
  const b = e.target;
  if (b.closest && b.closest("#rf")) regUI();
  if (b.tagName === "INPUT" && ["cq", "avatarUp"].includes(b.dataset.act))
    A[b.dataset.act](b.dataset, b);
});
document.addEventListener("submit", async (e) => {
  const f = e.target.closest("[data-form]");
  if (!f) return;
  e.preventDefault();
  const k = f.dataset.form,
    fd = new FormData(f),
    g = (n) => fd.get(n),
    id = f.dataset.id,
    btn = f.querySelector(".btn.p");
  if (btn) btn.disabled = true;
  try {
    if (k === "login" || k === "reg") {
    } else if (k === "pay" || k === "checkout") {
      if (!S.me) return;
    } else if (k === "pw") {
      if (!S.me) return;
    } else if (k === "adminpw") {
      if (!isAdmin()) return;
    } else if (k === "rej") {
      if (!needPos("Treasurer")) return;
    } else if (["prod", "lst"].includes(k)) {
      if (!guard("mgr")) return;
    } else if (
      k !== "sub" &&
      !["dm", "dmsg", "priv", "prefs", "email", "delme"].includes(k) &&
      k !== "prof" &&
      k !== "chat" &&
      !guard("teacher")
    )
      return;
    if (k === "sub") {
      const ph = await readFiles(f.photos);
      if (!ph.length) throw "Add at least one photo";
      S.subs.push({
        id: uid(),
        owner: S.me,
        name: g("name").trim(),
        cat: g("cat"),
        desc: g("desc").trim(),
        cond: g("cond"),
        price: +g("price"),
        size: g("size"),
        qty: Math.max(1, +g("qty")),
        contact: g("contact"),
        photos: ph,
        status: "pending",
        at: Date.now(),
      });
      toast("Submitted — pending teacher review");
    }
    if (k === "chat") {
      if (!guard("teacher")) return;
      S.chat.push({
        id: uid(),
        by: S.me,
        text: g("text").trim(),
        at: Date.now(),
      });
    }
    if (k === "dm") {
      const th = S.threads.find((x) => x.id === id);
      if (!th || (th.buyer !== S.me && th.seller !== S.me)) throw "Not allowed";
      th.msgs.push({
        id: uid(),
        by: S.me,
        text: g("text").trim(),
        at: Date.now(),
      });
    }
    if (k === "login") {
      const em = g("email").trim().toLowerCase(),
        u = S.users.find((x) => x.email === em);
      if (!u || !u.hash || (await hash(g("password"), u.salt)) !== u.hash)
        throw "Incorrect email or password";
      S.me = u.id;
      S.view = "home";
      toast("Welcome, " + u.name);
    }
    if (k === "reg") {
      const em = g("email").trim().toLowerCase(),
        role = g("role"),
        pw = g("password");
      if (S.users.some((x) => x.email === em))
        throw "That email is already registered";
      if (!["student", "teacher"].includes(role)) throw "Invalid account type";
      if (pw.length < 6) throw "Password must be at least 6 characters";
      const u = {
        id: uid(),
        email: em,
        name: g("name").trim(),
        role,
        gender: g("gender"),
        age: g("age"),
        phone: (g("phone") || "").trim(),
        wallet: 1000,
      };
      if (role === "teacher") {
        if (g("code") !== STAFF_CODE) throw "Invalid staff access code";
        u.pos = g("pos");
      } else
        Object.assign(u, {
          level: g("level"),
          grade: g("grade"),
          block: g("block").trim(),
          strand: (g("strand") || "").trim(),
        });
      u.salt = uid() + uid();
      u.hash = await hash(pw, u.salt);
      S.users.push(u);
      S.me = u.id;
      S.view = "home";
      toast("Account created. Welcome!");
    }
    if (k === "checkout") {
      const c = S.cart[S.me] || {},
        items = [];
      let total = 0;
      for (const kk in c) {
        const i = c[kk],
          p = P(i.pid);
        if (!p || i.qty > stock(p, i.size))
          throw `Not enough stock for ${p ? p.name : "an item"}`;
        const pr = unit(p, i.size);
        items.push({
          pid: i.pid,
          name: p.name,
          size: i.size,
          qty: i.qty,
          price: pr,
        });
        total += pr * i.qty;
      }
      if (!items.length) throw "Your cart is empty";
      const pay = await payData(f, fd);
      if (isOn(pay.method) && (me().wallet || 0) < total)
        throw `Not enough GCash balance (${peso(me().wallet)}). Choose Face to face instead.`;
      S.orders.push({
        id: uid(),
        no: "CM-" + ++S.seq,
        student: S.me,
        items,
        total,
        status: "pending_payment",
        at: Date.now(),
        pay,
      });
      S.cart[S.me] = {};
      S.view = "orders";
      toast("Order placed — Pending Payment");
    }
    if (k === "pay") {
      const o = ord(id);
      if (o.student !== S.me || o.status !== "payment_rejected")
        throw "Not allowed";
      o.pay = await payData(f, fd, o.pay);
      Object.assign(o, {
        status: "pending_payment",
        payBy: null,
        payAt: null,
        reason: "",
      });
      toast("Payment resubmitted");
    }
    if (k === "rej") {
      const o = ord(id);
      if (o.status !== "pending_payment") throw "Already decided";
      Object.assign(o, {
        status: "payment_rejected",
        reason: g("reason").trim(),
        payBy: S.me,
        payAt: Date.now(),
      });
      notify(o.student, `Order ${o.no} was declined: ${o.reason}`);
      toast("Payment rejected; student notified");
    }
    if (k === "adminpw" || k === "pw") {
      const u = me();
      if ((await hash(g("current"), u.salt)) !== u.hash)
        throw "Current password is incorrect";
      if (g("next").length < 6) throw "New password must be at least 6 characters";
      if (g("next") !== g("again")) throw "The new passwords do not match";
      u.salt = uid() + uid();
      u.hash = await hash(g("next"), u.salt);
      toast("Password changed");
    }
    if (k === "dmsg") {
      const d = S.dms.find((x) => x.id === id);
      if (!d || (d.a !== S.me && d.b !== S.me)) throw "Not allowed";
      const other = d.a === S.me ? d.b : d.a, text = g("text").trim();
      if (!canMsg(S.me, other, d)) throw "You can't message this person";
      if (!text) throw "Write a message first";
      if (d.status === "request") {
        if (d.a === S.me) {
          if (d.msgs.some((m) => m.by === S.me)) throw "Wait for them to accept your request before sending more";
        } else d.status = "accepted";
      }
      d.msgs.push({ id: uid(), by: S.me, text, at: Date.now() });
      d.at = Date.now();
      if (d.status === "request" && d.msgs.length === 1) notify(other, `${me().name} sent you a message request.`);
    }
    if (k === "priv") {
      Object.assign((me().set = { ...st(me()) }), { showEmail: fd.has("showEmail"), showPhone: fd.has("showPhone"), showAge: fd.has("showAge"), showGender: fd.has("showGender"), allowDm: g("allowDm") === "none" ? "none" : "everyone" });
      toast("Privacy saved");
    }
    if (k === "prefs") {
      Object.assign((me().set = { ...st(me()) }), { notif: fd.has("notif"), theme: ["light", "dark"].includes(g("theme")) ? g("theme") : "system", size: ["large", "xl"].includes(g("size")) ? g("size") : "normal" });
      toast("Settings saved");
    }
    if (k === "email") {
      const u = me(), em = g("email").trim().toLowerCase();
      if (!u.hash) throw "Demo accounts have no email or password";
      if ((await hash(g("current"), u.salt)) !== u.hash) throw "Current password is incorrect";
      if (S.users.some((x) => x.id !== u.id && x.email === em)) throw "That email is already used";
      u.email = em;
      toast("Email updated");
    }
    if (k === "delme") {
      const u = me();
      if (!u.hash || u.role === "admin") throw "This account cannot be deleted here";
      if ((await hash(g("current"), u.salt)) !== u.hash) throw "Password is incorrect";
      if (!(await confirmDlg("Delete your account permanently? This cannot be undone."))) { if (btn) btn.disabled = false; return; }
      const gone = u.id;
      S.me = null;
      removeUser(gone);
      S.view = "home";
      toast("Your account was deleted");
    }
    if (k === "ann")
      S.ann.push({
        id: uid(),
        text: g("text").trim(),
        by: S.me,
        at: Date.now(),
      });
    if (k === "prod") {
      const im = await readFiles(f.img, 1),
        has = g("hasSizes"),
        o = S.products.find((x) => x.id === id),
        v = {
          name: g("name").trim(),
          cat: g("cat"),
          price: +g("price"),
          desc: g("desc"),
          sizes: null,
          qty: 0,
        };
      if (has) {
        v.sizes = {};
        SIZES.forEach((z) => {
          const q = g("q_" + z);
          if (q !== "") {
            v.sizes[z] = { q: Math.max(0, +q) };
            if (g("p_" + z) !== "") v.sizes[z].price = +g("p_" + z);
          }
        });
        if (!Object.keys(v.sizes).length)
          throw "Add stock for at least one size";
      } else v.qty = Math.max(0, +g("qty"));
      if (o) {
        Object.assign(o, v);
        if (im[0]) o.img = im[0];
      } else S.products.push({ id: uid(), ...v, img: im[0] || "" });
      toast("Product saved");
    }
    if (k === "lst") {
      const l = S.listings.find((x) => x.id === id);
      Object.assign(l, { name: g("name"), price: +g("price"), qty: +g("qty") });
    }
    if (k === "prof") {
      const u = me();
      ["name", "phone", "grade", "block", "strand", "age", "gender"].forEach(
        (n) => {
          if (fd.has(n)) u[n] = g(n).trim();
        },
      );
    }
    save();
    if ($("#dlg").open) closeModal();
    render();
  } catch (err) {
    toast(typeof err === "string" ? err : "Something went wrong", "err");
    if (btn) btn.disabled = false;
  }
});
render();
