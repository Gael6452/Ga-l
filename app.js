// SECURITY_RUBRIC — comment est calculé le score affiché sur chaque outil
//   5/5  Open-source ET exécutable en local — aucune donnée ne sort de votre machine.
//   4/5  Hébergé en UE (RGPD), ou pas d'entraînement sur vos données + politique vérifiable.
//   3/5  Service hébergé hors UE avec politique correcte (opt-out d'entraînement, certifs).
//   2/5  Collecte large ou éditeur peu transparent — usage perso seulement.
//   1/5  Risques sérieux (déconseillé en pro).
//
// Accessibilité (Ligue Braille / WCAG 2.1 AA) :
//   - Les chips métier sont des <button aria-pressed> → annoncées comme
//     "bouton, sélectionné/non sélectionné" par les lecteurs d'écran.
//   - Le statut (titre + nb de résultats) est annoncé via #status (role=status).
//   - Le score sécurité est lu en texte ("Sécurité 4 sur 5") ; les pastilles
//     sont aria-hidden car redondantes.
//   - Les tags décoratifs (drapeau UE, flèche →) sont aria-hidden.

(function () {
  const jobsEl   = document.getElementById("jobs");
  const searchEl = document.getElementById("search");
  const cardsEl  = document.getElementById("cards");
  const titleEl  = document.getElementById("results-title");
  const countEl  = document.getElementById("count");
  const emptyEl  = document.getElementById("empty");
  const statusEl = document.getElementById("status");

  const fFree    = document.getElementById("f-free");
  const fPrivate = document.getElementById("f-private");
  const fEU      = document.getElementById("f-eu");
  const fOffline = document.getElementById("f-offline");
  const fHidden  = document.getElementById("f-hidden");
  const fSecure  = document.getElementById("f-secure");

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let selectedJob = null;
  let jobFilter = "";

  function announce(msg) {
    // Force re-announce by clearing first if same content.
    statusEl.textContent = "";
    // setTimeout pour laisser AT détecter le changement
    setTimeout(() => { statusEl.textContent = msg; }, 30);
  }

  function renderJobs() {
    const term = jobFilter.trim().toLowerCase();
    jobsEl.innerHTML = "";
    JOBS
      .filter(j => !term || j.label.toLowerCase().includes(term))
      .forEach(j => {
        const b = document.createElement("button");
        b.type = "button";
        const isActive = selectedJob === j.id;
        b.className = "chip" + (isActive ? " active" : "");
        b.textContent = j.label;
        b.setAttribute("aria-pressed", isActive ? "true" : "false");
        b.setAttribute("aria-label", `Métier : ${j.label}`);
        b.addEventListener("click", () => {
          selectedJob = selectedJob === j.id ? null : j.id;
          renderJobs();
          renderResults();
          if (selectedJob) {
            const tools = document.getElementById("tools");
            tools.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "start",
            });
            // place le focus clavier sur le titre des résultats
            titleEl.setAttribute("tabindex", "-1");
            titleEl.focus({ preventScroll: true });
          }
        });
        jobsEl.appendChild(b);
      });
  }

  function priceLabel(p) {
    if (p === "free")     return { cls: "free",     txt: "Gratuit" };
    if (p === "freemium") return { cls: "freemium", txt: "Freemium" };
    return                       { cls: "cheap",    txt: "Moins de 10 € par mois" };
  }

  function passesFilters(t) {
    if (fFree.checked    && !(t.price === "free" || t.price === "freemium")) return false;
    if (fPrivate.checked && !(t.flags || []).includes("private")) return false;
    if (fEU.checked      && !(t.flags || []).includes("eu"))      return false;
    if (fOffline.checked && !(t.flags || []).includes("offline")) return false;
    if (fHidden.checked  && !(t.flags || []).includes("hidden"))  return false;
    if (fSecure.checked  && (t.security || 0) < 4)                return false;
    return true;
  }

  function renderResults() {
    cardsEl.innerHTML = "";

    if (!selectedJob) {
      titleEl.textContent = "Choisissez un métier ci-dessus";
      countEl.textContent = "";
      emptyEl.classList.add("hidden");
      return;
    }

    const job = JOBS.find(j => j.id === selectedJob);
    const matches = TOOLS
      .filter(t => t.jobs.includes(selectedJob))
      .filter(passesFilters);

    titleEl.textContent = `Pour : ${job.label}`;
    countEl.textContent = `${matches.length} outil${matches.length > 1 ? "s" : ""}`;

    if (!matches.length) {
      emptyEl.classList.remove("hidden");
      announce(`Aucun outil ne correspond pour ${job.label} avec les filtres actuels.`);
      return;
    }
    emptyEl.classList.add("hidden");

    matches.sort((a, b) => {
      const score = t => (
        (t.security || 0) * 3 +
        ((t.flags || []).includes("hidden")  ? 2 : 0) +
        ((t.flags || []).includes("private") ? 1 : 0) +
        (t.price === "free"     ? 2 : 0) +
        (t.price === "freemium" ? 1 : 0)
      );
      return score(b) - score(a);
    });

    for (const t of matches) {
      cardsEl.appendChild(card(t));
    }

    announce(
      `${matches.length} outil${matches.length > 1 ? "s" : ""} recommandé${matches.length > 1 ? "s" : ""} pour ${job.label}.`
    );
  }

  function securityClass(s) {
    if (s >= 5) return "sec-5";
    if (s >= 4) return "sec-4";
    if (s >= 3) return "sec-3";
    if (s >= 2) return "sec-2";
    return "sec-1";
  }

  function card(t) {
    const p = priceLabel(t.price);
    const flags = t.flags || [];
    const sec = t.security || 3;

    // tags : libellé visible + label SR explicite (drapeau retiré pour AT)
    const tagEls = [];
    if (flags.includes("hidden"))  tagEls.push({ txt: "Pépite",     cls: "hidden-gem" });
    if (flags.includes("private")) tagEls.push({ txt: "Vie privée", cls: "good" });
    if (flags.includes("eu"))      tagEls.push({ txt: "RGPD — UE",  cls: "good", deco: "🇪🇺" });
    if (flags.includes("offline")) tagEls.push({ txt: "Hors-ligne", cls: "good" });

    const el = document.createElement("article");
    el.className = "tool";
    el.setAttribute(
      "aria-label",
      `${t.name}, ${p.txt}, sécurité ${sec} sur 5`
    );

    const h = document.createElement("h3");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = t.name;
    const priceSpan = document.createElement("span");
    priceSpan.className = "price " + p.cls;
    priceSpan.textContent = p.txt;
    h.appendChild(nameSpan);
    h.appendChild(priceSpan);
    el.appendChild(h);

    // Score de sécurité — texte lisible, pastilles décoratives
    const secRow = document.createElement("div");
    secRow.className = "sec-row";
    const badge = document.createElement("span");
    badge.className = "sec-badge " + securityClass(sec);
    const noteId = `sec-${Math.random().toString(36).slice(2, 9)}`;
    if (t.secNote) badge.setAttribute("aria-describedby", noteId);
    const shield = document.createElement("span");
    shield.className = "shield";
    shield.setAttribute("aria-hidden", "true");
    shield.textContent = "🛡";
    const secText = document.createElement("span");
    secText.textContent = `Sécurité ${sec} sur 5`;
    badge.appendChild(shield);
    badge.appendChild(secText);
    secRow.appendChild(badge);

    const dots = document.createElement("span");
    dots.className = "sec-dots";
    dots.setAttribute("aria-hidden", "true");
    for (let i = 1; i <= 5; i++) {
      const d = document.createElement("span");
      d.className = "dot" + (i <= sec ? " on" : "");
      dots.appendChild(d);
    }
    secRow.appendChild(dots);
    el.appendChild(secRow);

    if (t.secNote) {
      const note = document.createElement("p");
      note.className = "sec-note";
      note.id = noteId;
      note.textContent = t.secNote;
      el.appendChild(note);
    }

    const desc = document.createElement("p");
    desc.textContent = t.why;
    el.appendChild(desc);

    if (tagEls.length) {
      const tags = document.createElement("ul");
      tags.className = "tags";
      tags.setAttribute("aria-label", "Caractéristiques");
      tagEls.forEach(({ txt, cls, deco }) => {
        const li = document.createElement("li");
        li.className = "tag " + cls;
        if (deco) {
          const d = document.createElement("span");
          d.setAttribute("aria-hidden", "true");
          d.textContent = deco + " ";
          li.appendChild(d);
        }
        li.appendChild(document.createTextNode(txt));
        tags.appendChild(li);
      });
      el.appendChild(tags);
    }

    const foot = document.createElement("div");
    foot.className = "tool-foot";
    const a = document.createElement("a");
    a.href = t.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "visit";
    a.setAttribute("aria-label", `Tester ${t.name} (nouvel onglet)`);
    const linkText = document.createElement("span");
    linkText.textContent = "Tester";
    const linkArrow = document.createElement("span");
    linkArrow.setAttribute("aria-hidden", "true");
    linkArrow.textContent = " →";
    const linkExt = document.createElement("span");
    linkExt.className = "sr-only";
    linkExt.textContent = " (s'ouvre dans un nouvel onglet)";
    a.appendChild(linkText);
    a.appendChild(linkArrow);
    a.appendChild(linkExt);
    foot.appendChild(a);
    el.appendChild(foot);

    return el;
  }

  // ---------- events ----------
  searchEl.addEventListener("input", e => {
    jobFilter = e.target.value;
    renderJobs();
  });
  [fFree, fPrivate, fEU, fOffline, fHidden, fSecure].forEach(el => {
    el.addEventListener("change", renderResults);
  });

  // init
  renderJobs();
  renderResults();
})();
