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

    // tri : pépites & gratuits d'abord
    matches.sort((a, b) => {
      const score = t => (
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

  function card(t) {
    const p = priceLabel(t.price);
    const flags = t.flags || [];

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
