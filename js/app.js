(function () {
  const $app = document.getElementById('app');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (t, ms = 2800) => { const el = document.getElementById('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), ms); };
  const draft = { emploi: null, competences: [], transversales: [], niveau: 2, nbApprenants: 4, evolutive: false };
  let current = null; // MSP ouverte

  /* ---------- utilitaires de chemin pour l'édition ---------- */
  function getP(o, p) { return p.split('.').reduce((a, k) => a == null ? a : a[k], o); }
  function setP(o, p, v) { const ks = p.split('.'); const last = ks.pop(); const t = ks.reduce((a, k) => a[k], o); t[last] = v; }
  const ed = (path, val, cls) => `<span class="ed ${cls || ''}" contenteditable="true" spellcheck="false" data-p="${path}">${esc(val)}</span>`;
  const edBlock = (path, val) => `<div class="ed block" contenteditable="true" spellcheck="false" data-p="${path}">${esc(val)}</div>`;
  const delBtn = (arr, i) => `<button class="mini no-print" data-act="del" data-arr="${arr}" data-i="${i}" title="Supprimer" aria-label="Supprimer la ligne">[x]</button>`;

  /* ---------- routeur ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, '') || 'nouveau';
    const [name, arg] = h.split('/');
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === name || (name === 'fiche' && a.dataset.nav === 'nouveau')));
    if (name === 'fiche') { const m = Store.get(arg); if (!m) { location.hash = '#/historique'; return; } current = m; viewFiche(); }
    else if (name === 'historique') viewHistory();
    else if (name === 'reglages') viewSettings();
    else viewNew();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  /* ---------- vue : nouvelle MSP ---------- */
  function viewNew() {
    const emplois = Object.keys(DATA.referentiels);
    const e = draft.emploi && DATA.referentiels[draft.emploi];
    let comps = '';
    if (e) {
      const count = draft.competences.length;
      comps = `<section class="card"><h2><span class="step">[2]</span> Compétences à travailler <small>1 à 4, issues du ${esc(e.label)}</small></h2>
        <p class="hint">${count} sélectionnée(s). Choisis celles que tu veux voir en situation ; au-delà de 4, l'observateur ne suit plus.</p>
        ${e.domaines.map(d => `<details ${d.blocs.some(b => b.competences.some(c => draft.competences.includes(c.id))) ? 'open' : ''}><summary>${esc(d.label)}</summary>
          ${d.blocs.map(b => `<fieldset><legend>${esc(b.bloc)}</legend>${b.competences.map(c => `<label class="check"><input type="checkbox" data-comp="${c.id}" ${draft.competences.includes(c.id) ? 'checked' : ''}><span>${esc(c.label)}</span></label>`).join('')}</fieldset>`).join('')}</details>`).join('')}
        <details><summary>Compétences transversales évaluées en même temps (facultatif)</summary>
          ${e.transversales.map(b => `<fieldset><legend>${esc(b.bloc)}</legend>${b.competences.map(c => `<label class="check"><input type="checkbox" data-trans="${c.id}" ${draft.transversales.includes(c.id) ? 'checked' : ''}><span>${esc(c.label)}</span></label>`).join('')}</fieldset>`).join('')}</details>
      </section>`;
    }
    $app.innerHTML = `
      <section class="intro"><h1>Prépare une MSP en quelques clics</h1>
        <p>Choisis un emploi et des compétences : l'application assemble une fiche complète (scénario, rôles, sécurité, évènements, grille, débriefing) que tu peux modifier puis imprimer.</p></section>
      <section class="card"><h2><span class="step">[1]</span> Emploi</h2>
        <div class="emplois">${emplois.map(k => `<label class="emploi ${draft.emploi === k ? 'on' : ''}"><input type="radio" name="emploi" value="${k}" ${draft.emploi === k ? 'checked' : ''}><b><span class="mk">${draft.emploi === k ? '[x]' : '[ ]'}</span> ${esc(DATA.referentiels[k].label)}</b><small>${esc(DATA.referentiels[k].source)}</small></label>`).join('')}</div></section>
      ${comps}
      ${e ? `<section class="card"><h2><span class="step">[3]</span> Paramètres</h2>
        <div class="grid">
          <div><div class="lab">Difficulté (ZPD)</div><div class="seg" role="radiogroup">${[[1, 'Découverte'], [2, 'Standard'], [3, 'Avancée']].map(([n, l]) => `<label class="${draft.niveau === n ? 'on' : ''}"><input type="radio" name="niveau" value="${n}" ${draft.niveau === n ? 'checked' : ''}>${l}</label>`).join('')}</div>
            <p class="hint">Plus c'est difficile, plus il y a de contraintes et d'évènements injectés.</p></div>
          <div><div class="lab">Nombre de stagiaires</div><div class="stepper"><button type="button" data-act="nb" data-d="-1" aria-label="Moins">−</button><output>${draft.nbApprenants}</output><button type="button" data-act="nb" data-d="1" aria-label="Plus">+</button></div></div>
          <div><label class="check"><input type="checkbox" id="evol" ${draft.evolutive ? 'checked' : ''}><span><b>MSP évolutive</b><small>2 à 3 évènements injectés, chacun avec son déclencheur</small></span></label></div>
        </div></section>
        <div class="actions"><button class="btn primary big" id="gen" ${draft.competences.length < 1 || draft.competences.length > 4 ? 'disabled' : ''}>Générer la MSP</button>
        ${draft.competences.length > 4 ? '<span class="warn">4 compétences maximum</span>' : ''}</div>` : ''}`;
  }

  $app.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'emploi') { draft.emploi = t.value; draft.competences = []; draft.transversales = []; viewNew(); }
    else if (t.dataset.comp) { toggle(draft.competences, t.dataset.comp, t.checked); viewNewKeepScroll(); }
    else if (t.dataset.trans) toggle(draft.transversales, t.dataset.trans, t.checked);
    else if (t.name === 'niveau') { draft.niveau = +t.value; viewNewKeepScroll(); }
    else if (t.id === 'evol') draft.evolutive = t.checked;
  });
  function toggle(arr, v, on) { const i = arr.indexOf(v); if (on && i < 0) arr.push(v); if (!on && i >= 0) arr.splice(i, 1); }
  function viewNewKeepScroll() { const y = window.scrollY; viewNew(); window.scrollTo(0, y); }

  /* ---------- vue : fiche ---------- */
  function viewFiche() {
    const m = current;
    const d = DATA.domaines[m.domaine];
    $app.innerHTML = `
      <div class="toolbar no-print">
        <a class="btn ghost" href="#/nouveau">Nouvelle MSP</a>
        <button class="btn" data-act="regen">Régénérer le scénario</button>
        <button class="btn" data-act="ai-rewrite" title="Réécrit le scénario avec Gemini">Scénario (IA)</button>
        <button class="btn" data-act="ai-inject" title="Propose des évènements avec Gemini">Évènements (IA)</button>
        <button class="btn" data-act="dup">Dupliquer</button>
        <button class="btn primary" data-act="print">Imprimer / PDF</button>
      </div>
      <article class="sheet" id="sheet">
        <header class="sheet-head">
          <div class="eyebrow">MISE EN SITUATION PROFESSIONNELLE · ${esc(m.emploiLabel.toUpperCase())}</div>
          <h1>${ed('titre', m.titre)}</h1>
          <div class="meta"><span>${esc(d)}</span><span>Difficulté ${m.niveau}/3 (${['', 'découverte', 'standard', 'avancée'][m.niveau]})</span><span>${ed('duree', m.duree)} min + débriefing ${esc(m.dureeDebrief)}</span><span>${m.nbApprenants} stagiaire(s)</span>${m.evolutive ? '<span>MSP évolutive</span>' : ''}</div>
          <div class="stamp">${esc(m.statut)}</div>
        </header>

        <section><h2>Objectif</h2>${edBlock('objectif', m.objectif)}</section>

        <section><h2>Compétences visées</h2>
          <ul class="comp">${m.grille.map(g => `<li><b>${esc(g.competence)}</b>${g.transv ? ' <em>(transversale)</em>' : ''}<br><small>${esc(g.bloc)}</small></li>`).join('')}</ul></section>

        <section><h2>Site et moyens</h2>
          <p><b>Site :</b> ${ed('site', m.site)}</p>
          <ul class="list">${m.moyens.map((x, i) => `<li>${ed('moyens.' + i, x)}${delBtn('moyens', i)}</li>`).join('')}</ul>
          <button class="mini add no-print" data-act="add" data-arr="moyens">[+] moyen</button></section>

        <section><h2>Scénario</h2>
          <div class="kv"><b>Alerte</b>${edBlock('alerte', m.alerte)}</div>
          <div class="kv"><b>À l'arrivée</b>${edBlock('arrivee', m.arrivee)}</div>
          <div class="kv"><b>Évolution</b>${edBlock('evolution', m.evolution)}</div>
          ${m.contraintes.length ? `<div class="kv"><b>Contraintes</b><ul class="list">${m.contraintes.map((x, i) => `<li>${ed('contraintes.' + i, x)}${delBtn('contraintes', i)}</li>`).join('')}</ul></div>` : ''}
          <button class="mini add no-print" data-act="add" data-arr="contraintes">[+] contrainte</button></section>

        <section><h2>Rôles</h2>
          <table><thead><tr><th>Rôle</th><th>Mission</th><th class="no-print"></th></tr></thead><tbody>
          ${m.roles.map((r, i) => `<tr><td>${ed('roles.' + i + '.role', r.role)}</td><td>${edBlock('roles.' + i + '.mission', r.mission)}</td><td class="no-print">${delBtn('roles', i)}</td></tr>`).join('')}</tbody></table>
          <button class="mini add no-print" data-act="add" data-arr="roles">[+] rôle</button></section>

        <section><h2>Sécurité et analyse de risques</h2>
          <table><thead><tr><th>Risque</th><th>Mesure</th><th class="no-print"></th></tr></thead><tbody>
          ${m.risques.map((r, i) => `<tr><td>${edBlock('risques.' + i + '.r', r.r)}</td><td>${edBlock('risques.' + i + '.m', r.m)}</td><td class="no-print">${delBtn('risques', i)}</td></tr>`).join('')}</tbody></table>
          <button class="mini add no-print" data-act="add" data-arr="risques">[+] risque</button></section>

        <section><h2>Évènements injectés</h2>
          ${m.injections.length ? `<table><thead><tr><th>Déclencheur</th><th>Évènement</th><th>Attendu de l'apprenant</th><th class="no-print"></th></tr></thead><tbody>
          ${m.injections.map((x, i) => `<tr><td>${edBlock('injections.' + i + '.t', x.t)}</td><td>${edBlock('injections.' + i + '.e', x.e)}</td><td>${edBlock('injections.' + i + '.a', x.a)}</td><td class="no-print">${delBtn('injections', i)}</td></tr>`).join('')}</tbody></table>` : '<p class="hint">Aucun évènement injecté à ce niveau. Ajoutes-en un si besoin.</p>'}
          <button class="mini add no-print" data-act="add" data-arr="injections">[+] évènement</button>
          ${m.doctrine && (m.doctrine.ecueils.length || m.doctrine.situations.length) ? `<div class="ideas no-print"><h3>Pistes issues des guides GDO / GTO</h3><p class="hint">Écueils fréquents et situations types cités par les guides. Un clic les ajoute aux évènements.</p><ul class="list">${['ecueils', 'situations'].map(k => m.doctrine[k].map((x, i) => `<li>${esc(x.t)} <small>(${esc(x.src)}, p. ${esc(x.p)})</small> <button class="mini" data-act="idea" data-k="${k}" data-i="${i}">[+] ajouter</button></li>`).join('')).join('')}</ul></div>` : ''}</section>

        <section><h2>Grille d'observation</h2>
          <p class="hint">Cotation : A acquise, ECA en cours d'acquisition, NA non acquise. À remplir avec des faits et des heures. La même grille sert à l'auto-évaluation du stagiaire.</p>
          <table class="grid-obs"><thead><tr><th>Compétence et savoirs-agir</th><th>Faits observés / heure</th><th class="cot">A</th><th class="cot">ECA</th><th class="cot">NA</th></tr></thead><tbody>
          ${m.grille.map(g => `<tr class="comp-row"><td colspan="5"><b>${esc(g.competence)}</b></td></tr>${g.savoirs.map(s => `<tr><td>${esc(s)}</td><td></td><td class="cot">☐</td><td class="cot">☐</td><td class="cot">☐</td></tr>`).join('')}`).join('')}</tbody></table>
          <h3>Indicateurs observables suggérés</h3>
          <ul class="list">${m.indicateurs.map((x, i) => `<li>${ed('indicateurs.' + i, x)}${delBtn('indicateurs', i)}</li>`).join('')}</ul>
          <button class="mini add no-print" data-act="add" data-arr="indicateurs">[+] indicateur</button></section>

        <section><h2>Débriefing en 5 temps</h2>
          ${m.debrief.map((t, ti) => `<div class="temps"><b>${esc(t.temps)}</b><ul class="list">${t.questions.map((q, qi) => `<li>${ed('debrief.' + ti + '.questions.' + qi, q)}</li>`).join('')}</ul></div>`).join('')}
          <p class="hint">À éviter : « Pourquoi tu n'as pas… ? », une question fermée qui contient la réponse, un avis donné avant que l'apprenant se soit exprimé.</p></section>

        <section><h2>Suite à donner (matrice compétence / performance)</h2>
          <table><thead><tr><th>Constat</th><th>Décision</th></tr></thead><tbody>${m.suite.map(s => `<tr><td>${esc(s.cas)}</td><td>${esc(s.dec)}</td></tr>`).join('')}</tbody></table></section>

        ${m.doctrine && m.doctrine.reperes.length ? `<section><h2>Repères de doctrine (GDO / GTO)</h2><ul class="list">${m.doctrine.reperes.map(x => `<li>${esc(x.t)} <small>(${esc(x.src)}, p. ${esc(x.p)})</small></li>`).join('')}</ul></section>` : ''}

        <footer class="sheet-foot"><p>Compétences et savoirs-agir : RNAC et RNE nationaux (DGSCGC, 2019). Scénario : brouillon à valider par un formateur. Les gestes et la doctrine renvoient aux guides GDO/GTO et aux RTN en vigueur.</p>
        <p>Généré par le Générateur de MSP, le ${new Date(m.updatedAt || Date.now()).toLocaleDateString('fr-FR')}.</p></footer>
      </article>`;
  }

  const TEMPLATES = { moyens: '', contraintes: '', indicateurs: '', roles: { role: 'Nouveau rôle', mission: '' }, risques: { r: '', m: '' }, injections: { t: '', e: '', a: '' } };
  let saveT;
  function persist() { clearTimeout(saveT); saveT = setTimeout(() => { Store.save(current); }, 350); }

  $app.addEventListener('input', e => {
    const t = e.target.closest('[data-p]'); if (!t || !current) return;
    let v = t.innerText.replace(/ /g, ' ');
    if (t.dataset.p === 'duree') v = parseInt(v, 10) || current.duree;
    setP(current, t.dataset.p, v); persist();
  });
  $app.addEventListener('paste', e => {
    if (!e.target.closest('[contenteditable]')) return;
    e.preventDefault(); const txt = (e.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, txt);
  });
  $app.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('span.ed')) e.preventDefault(); });

  /* ---------- actions ---------- */
  $app.addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act;
    if (act === 'nb') { draft.nbApprenants = Math.min(12, Math.max(1, draft.nbApprenants + +b.dataset.d)); b.parentElement.querySelector('output').textContent = draft.nbApprenants; }
    else if (act === 'del') { current[b.dataset.arr].splice(+b.dataset.i, 1); Store.save(current); viewFiche(); }
    else if (act === 'add') { const a = b.dataset.arr; current[a].push(typeof TEMPLATES[a] === 'object' ? { ...TEMPLATES[a] } : ''); Store.save(current); viewFiche(); }
    else if (act === 'print') window.print();
    else if (act === 'dup') { const c = Store.duplicate(current.id); if (c) { location.hash = '#/fiche/' + c.id; toast('MSP dupliquée'); } }
    else if (act === 'regen') {
      if (!confirm('Remplacer le scénario, les rôles, les risques et les évènements par une nouvelle proposition ? Tes modifications sur ces blocs seront perdues.')) return;
      const n = Engine.generate(current.params, null);
      ['titre', 'site', 'moyens', 'alerte', 'arrivee', 'evolution', 'contraintes', 'roles', 'risques', 'injections', 'indicateurs', 'duree', 'domaine', 'scenarioId', 'seed', 'doctrine'].forEach(k => current[k] = n[k]);
      Store.save(current); viewFiche(); toast('Nouveau scénario proposé');
    }
    else if (act === 'ai-rewrite' || act === 'ai-inject') {
      if (!AI.getKey()) { toast('Ajoute d\'abord ta clé Gemini dans Réglages.'); location.hash = '#/reglages'; return; }
      const old = b.textContent; b.disabled = true; b.textContent = 'Gemini réfléchit…';
      try {
        if (act === 'ai-rewrite') { const r = await AI.rewriteScenario(current); ['titre', 'alerte', 'arrivee', 'evolution'].forEach(k => { if (r[k]) current[k] = String(r[k]); }); toast('Scénario réécrit : relis-le avant usage'); }
        else { const r = await AI.proposeInjections(current); if (Array.isArray(r)) current.injections = current.injections.concat(r.map(x => ({ t: String(x.t || ''), e: String(x.e || ''), a: String(x.a || '') }))); toast('Évènements ajoutés : relis-les avant usage'); }
        Store.save(current); viewFiche();
      } catch (err) { toast(err.message, 5000); b.disabled = false; b.textContent = old; }
    }
    else if (act === 'idea') { const x = current.doctrine[b.dataset.k][+b.dataset.i]; current.injections.push({ t: 'à définir', e: x.t + ' (' + x.src + ', p. ' + x.p + ')', a: '' }); Store.save(current); viewFiche(); toast('Évènement ajouté'); }
    else if (act === 'open') location.hash = '#/fiche/' + b.dataset.id;
    else if (act === 'dup-h') { Store.duplicate(b.dataset.id); viewHistory(); }
    else if (act === 'rm-h') { if (confirm('Supprimer cette MSP de l\'historique ?')) { Store.remove(b.dataset.id); viewHistory(); } }
  });

  $app.addEventListener('click', e => {
    if (e.target.id !== 'gen') return;
    const params = { emploi: draft.emploi, competences: draft.competences.slice(), transversales: draft.transversales.slice(), niveau: draft.niveau, nbApprenants: draft.nbApprenants, evolutive: draft.evolutive };
    const m = Engine.generate(params, null); m.params = params;
    Store.save(m); location.hash = '#/fiche/' + m.id;
  });

  /* ---------- historique ---------- */
  function viewHistory() {
    const list = Store.list();
    $app.innerHTML = `<section class="intro"><h1>Historique</h1><p>Les MSP générées sont enregistrées sur cet appareil, dans ce navigateur. Rien n'est envoyé ailleurs.</p></section>
      ${list.length ? `<ul class="hist">${list.map(m => `<li class="card"><div><b>${esc(m.titre)}</b><small>${esc(m.emploiLabel)} · ${esc(DATA.domaines[m.domaine] || '')} · niveau ${m.niveau}/3 · ${new Date(m.updatedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</small></div>
        <div class="row"><button class="btn primary" data-act="open" data-id="${m.id}">Ouvrir</button><button class="btn" data-act="dup-h" data-id="${m.id}">Dupliquer</button><button class="btn ghost" data-act="rm-h" data-id="${m.id}">Supprimer</button></div></li>`).join('')}</ul>` : '<p class="empty">Aucune MSP pour le moment. <a href="#/nouveau">Créer la première</a>.</p>'}
      <section class="card"><h2>Sauvegarde</h2><p class="hint">Exporte ton historique pour le garder ou le changer d'appareil.</p>
        <div class="row"><button class="btn" id="export">Exporter (.json)</button><label class="btn">Importer<input type="file" id="import" accept="application/json" hidden></label></div></section>`;
  }
  $app.addEventListener('click', e => {
    if (e.target.id === 'export') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([Store.exportAll()], { type: 'application/json' })); a.download = 'historique-msp.json'; a.click(); }
  });
  $app.addEventListener('change', e => {
    if (e.target.id !== 'import') return; const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { try { toast(Store.importAll(r.result) + ' MSP lues'); viewHistory(); } catch (err) { toast('Fichier invalide'); } }; r.readAsText(f);
  });

  /* ---------- réglages ---------- */
  function viewSettings() {
    $app.innerHTML = `<section class="intro"><h1>Réglages</h1></section>
      <section class="card"><h2>Enrichir avec l'IA (facultatif)</h2>
        <p class="hint">Les boutons « Scénario (IA) » et « Évènements (IA) » utilisent Gemini avec <b>ta propre clé</b>. Elle est gardée dans ce navigateur et envoyée uniquement à Google. Sans clé, tout le reste fonctionne.</p>
        <label class="lab" for="key">Clé d'API Gemini</label><input id="key" type="password" autocomplete="off" value="${esc(AI.getKey())}" placeholder="AIza…">
        <label class="lab" for="model">Modèle</label><select id="model">${AI.MODELS.map(m => `<option ${AI.getModel() === m ? 'selected' : ''}>${m}</option>`).join('')}</select>
        <div class="row"><button class="btn primary" id="savekey">Enregistrer</button><button class="btn ghost" id="clearkey">Effacer la clé</button></div></section>
      <section class="card"><h2>À propos</h2>
        <p>Les <b>compétences et savoirs-agir</b> viennent des référentiels nationaux d'activités et de compétences (RNAC) et d'évaluation (RNE) des sapeurs-pompiers volontaires (DGSCGC, 2019) : équipier, chef d'équipe, chef d'agrès d'un engin comportant une équipe, chef d'agrès tout engin.</p>
        <p>Les <b>scénarios</b> sont des brouillons rédigés pour aider à concevoir une MSP. Ils doivent être relus et validés par un formateur. Ils ne remplacent ni les guides de doctrine (GDO), ni les guides de techniques (GTO), ni les références techniques nationales (RTN) en vigueur.</p>
        <p>Les <b>repères de doctrine</b> citent leur guide et leur page. Ils viennent de synthèses automatiques (Gemini) des guides nationaux ci-dessous : à relire dans le guide avant de s'y fier.</p>
        ${DATA.doctrine && DATA.doctrine.length ? '<ul class="list">' + DATA.doctrine.map(g => '<li>' + esc(g.titre) + '</li>').join('') + '</ul>' : '<p class="hint">Aucun guide chargé pour le moment.</p>'}
        <p class="hint">Aucune donnée personnelle n'est collectée. L'historique reste dans ton navigateur.</p></section>
      <section class="card"><h2>Données</h2><button class="btn ghost" id="wipe">Effacer tout l'historique</button></section>`;
  }
  $app.addEventListener('click', e => {
    const id = e.target.id;
    if (id === 'savekey') { AI.setKey(document.getElementById('key').value.trim()); AI.setModel(document.getElementById('model').value); toast('Réglages enregistrés'); }
    else if (id === 'clearkey') { AI.setKey(''); viewSettings(); toast('Clé effacée'); }
    else if (id === 'wipe' && confirm('Effacer toutes les MSP enregistrées sur cet appareil ?')) { Store.list().forEach(m => Store.remove(m.id)); toast('Historique effacé'); }
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
  route();
})();
