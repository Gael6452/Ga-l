// SECURITY_RUBRIC — comment est calculé le score affiché sur chaque outil
//   5/5  Open-source ET exécutable en local — aucune donnée ne sort de votre machine.
//   4/5  Hébergé en UE (RGPD), ou pas d'entraînement sur vos données + politique vérifiable.
//   3/5  Service hébergé hors UE avec politique correcte (opt-out d'entraînement, certifs).
//   2/5  Collecte large ou éditeur peu transparent — usage perso seulement.
//   1/5  Risques sérieux (déconseillé en pro).

(function () {
  const jobsEl   = document.getElementById("jobs");
  const searchEl = document.getElementById("search");
  const cardsEl  = document.getElementById("cards");
  const titleEl  = document.getElementById("results-title");
  const countEl  = document.getElementById("count");
  const emptyEl  = document.getElementById("empty");

  const fFree    = document.getElementById("f-free");
  const fPrivate = document.getElementById("f-private");
  const fEU      = document.getElementById("f-eu");
  const fOffline = document.getElementById("f-offline");
  const fHidden  = document.getElementById("f-hidden");
  const fSecure  = document.getElementById("f-secure");

  let selectedJob = null;
  let jobFilter = "";

  function renderJobs() {
    const term = jobFilter.trim().toLowerCase();
    jobsEl.innerHTML = "";
    JOBS
      .filter(j => !term || j.label.toLowerCase().includes(term))
      .forEach(j => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip" + (selectedJob === j.id ? " active" : "");
        b.textContent = j.label;
        b.setAttribute("role", "option");
        b.setAttribute("aria-selected", selectedJob === j.id ? "true" : "false");
        b.addEventListener("click", () => {
          selectedJob = selectedJob === j.id ? null : j.id;
          renderJobs();
          renderResults();
          if (selectedJob) {
            document.getElementById("tools").scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
        jobsEl.appendChild(b);
      });
  }

  function priceLabel(p) {
    if (p === "free")     return { cls: "free",     txt: "Gratuit" };
    if (p === "freemium") return { cls: "freemium", txt: "Freemium" };
    return                       { cls: "cheap",    txt: "< 10 €/mois" };
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
      return;
    }
    emptyEl.classList.add("hidden");

    // tri : sécurité d'abord, puis pépites/gratuits
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

    const tagEls = [];
    if (flags.includes("hidden"))  tagEls.push(['Pépite',          'hidden-gem']);
    if (flags.includes("private")) tagEls.push(['Vie privée',      'good']);
    if (flags.includes("eu"))      tagEls.push(['🇪🇺 RGPD',          'good']);
    if (flags.includes("offline")) tagEls.push(['Hors-ligne',      'good']);

    const el = document.createElement("article");
    el.className = "tool";

    const h = document.createElement("h3");
    h.innerHTML = `<span></span><span class="price ${p.cls}">${p.txt}</span>`;
    h.firstElementChild.textContent = t.name;
    el.appendChild(h);

    // Score de sécurité
    const secRow = document.createElement("div");
    secRow.className = "sec-row";
    const badge = document.createElement("span");
    badge.className = "sec-badge " + securityClass(sec);
    badge.title = t.secNote || "";
    badge.innerHTML = `<span class="shield" aria-hidden="true">🛡</span><span>Sécurité ${sec}/5</span>`;
    secRow.appendChild(badge);
    const dots = document.createElement("span");
    dots.className = "sec-dots";
    dots.setAttribute("aria-label", `Score de sécurité ${sec} sur 5`);
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
      note.textContent = t.secNote;
      el.appendChild(note);
    }

    const desc = document.createElement("p");
    desc.textContent = t.why;
    el.appendChild(desc);

    if (tagEls.length) {
      const tags = document.createElement("div");
      tags.className = "tags";
      tagEls.forEach(([txt, cls]) => {
        const s = document.createElement("span");
        s.className = "tag " + cls;
        s.textContent = txt;
        tags.appendChild(s);
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
    a.textContent = "Tester →";
    foot.appendChild(a);
    el.appendChild(foot);

    return el;
  }

  // events
  searchEl.addEventListener("input", e => {
    jobFilter = e.target.value;
    renderJobs();
  });
  [fFree, fPrivate, fEU, fOffline, fHidden].forEach(el => {
    el.addEventListener("change", renderResults);
  });

  // init
  renderJobs();
  renderResults();
})();
