/* Moteur de génération de MSP (sans IA). Tout est déterministe à partir d'une graine. */
(function () {
  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  function sample(r, arr, n) { const a = arr.slice(), out = []; while (a.length && out.length < n) out.push(a.splice(Math.floor(r() * a.length), 1)[0]); return out; }

  const COMMON_RISKS = [
    { r: 'Analyse de risques du site', m: 'Rédigée et signée avant l\'exercice, remise à l\'équipe pédagogique' },
    { r: 'Autorisation d\'utiliser le site', m: 'Accord écrit du responsable du site' },
    { r: 'Sécurité des participants', m: 'Briefing de sécurité à tous, rappel du droit de retrait, mot d\'arrêt « STOP sécurité » réservé au responsable sécurité' },
    { r: 'Matériel et équipements', m: 'EPI et matériels contrôlés avant l\'exercice, remise en condition après' },
    { r: 'Activité opérationnelle en parallèle', m: 'Le stagiaire n\'assure pas en propre l\'activité pour laquelle il se forme (CSI R.723-16)' }
  ];

  const SUITE = [
    { cas: 'Raisonnement pertinent et geste conforme', dec: 'Compétence acquise : refaire une MSP avec une difficulté plus élevée (ZPD)' },
    { cas: 'Raisonnement pertinent, geste à corriger', dec: 'APP ciblé sur la technique, puis nouvelle MSP' },
    { cas: 'Raisonnement incomplet, geste conforme', dec: 'Réussite possible par imitation : nouvelle MSP avec raisonnement à voix haute' },
    { cas: 'Raisonnement incomplet, geste non conforme', dec: 'Compétence non acquise : APP, puis nouvelle MSP' }
  ];

  function allCompetences(emploi) {
    const e = DATA.referentiels[emploi], out = [];
    e.domaines.forEach(d => d.blocs.forEach(b => b.competences.forEach(c => out.push({ ...c, domaine: d.domaine, bloc: b.bloc, transv: false }))));
    e.transversales.forEach(b => b.competences.forEach(c => out.push({ ...c, domaine: null, bloc: b.bloc, transv: true })));
    return out;
  }

  function chooseScenario(r, emploi, comps, forcedId) {
    if (forcedId) { const s = DATA.scenarios.find(x => x.id === forcedId); if (s) return s; }
    const count = {};
    comps.filter(c => !c.transv).forEach(c => count[c.domaine] = (count[c.domaine] || 0) + 1);
    const domaines = Object.keys(count).sort((a, b) => count[b] - count[a]);
    for (const d of domaines) {
      const ok = DATA.scenarios.filter(s => s.domaine === d && s.emplois.includes(emploi));
      if (ok.length) return pick(r, ok);
    }
    for (const d of domaines) { const any = DATA.scenarios.filter(s => s.domaine === d); if (any.length) return pick(r, any); }
    return pick(r, DATA.scenarios.filter(s => s.emplois.includes(emploi)));
  }

  function pickInjections(r, sc, niveau, evolutive) {
    let list = sc.injections.filter(i => i.n <= niveau);
    if (evolutive && list.length < 2) list = sc.injections.slice(0, 2);
    if (!evolutive && niveau === 1) list = list.slice(0, 1);
    return list.map(i => ({ t: i.t, e: i.e, a: i.a }));
  }

  function pickContraintes(r, domaine, niveau) {
    const n = niveau === 1 ? 0 : niveau === 2 ? 1 : 2;
    return sample(r, DATA.contraintes.general.concat(DATA.contraintes[domaine] || []), n);
  }

  function doctrineFor(r, domaine, emploi) {
    if (!DATA.doctrine) return null;
    const guides = DATA.doctrine.filter(g => (g.domaines.includes(domaine) || g.domaines.includes('tous')) && (!g.emplois || g.emplois.includes(emploi)));
    if (!guides.length) return null;
    const reperes = [], risques = [], indic = [], sit = [], ecu = [];
    guides.forEach(g => {
      sample(r, g.situations || [], 2).forEach(x => sit.push({ t: x.t, src: g.titre, p: x.p }));
      sample(r, g.ecueils || [], 2).forEach(x => ecu.push({ t: x.t, src: g.titre, p: x.p }));
      sample(r, g.reperes || [], 3).forEach(x => reperes.push({ t: x.t, src: g.titre, p: x.p }));
      sample(r, g.risques || [], 2).forEach(x => risques.push({ r: x.r, m: x.m, src: g.titre, p: x.p }));
      sample(r, g.indicateurs || [], 2).forEach(x => indic.push({ t: x.t, src: g.titre, p: x.p }));
    });
    return { reperes: sample(r, reperes, 8), risques: sample(r, risques, 4), indicateurs: sample(r, indic, 4), situations: sample(r, sit, 3), ecueils: sample(r, ecu, 4), guides: guides.map(g => g.titre) };
  }

  function debrief(comps) {
    const q = comps.filter(c => !c.transv).slice(0, 4).map(c => `« ${c.label} » : prends un moment précis. Que fais-tu exactement ? Qu'est-ce que tu regardais à ce moment-là ?`);
    return [
      { temps: '1. Ressenti (1 à 2 min)', questions: ['Comment ça va ? Quel est ton premier ressenti ?'] },
      { temps: '2. Faits (3 à 4 min)', questions: ['Raconte-moi depuis ton arrivée. Qu\'as-tu vu en premier ? Et ensuite ?'] },
      { temps: '3. Analyse : observer, analyser, décider (5 à 8 min)', questions: q.concat(['Quelles autres options avais-tu ?', 'Qu\'est-ce qui t\'aurait fait changer d\'avis ?']) },
      { temps: '4. Auto-cotation (3 min)', questions: ['Sur ce critère, tu te situes où (A, ECA, NA) ? Sur quels faits t\'appuies-tu ?'] },
      { temps: '5. Suite du parcours (2 min)', questions: ['De quoi aurais-tu besoin : refaire, un atelier (APP), une situation plus difficile ?'] }
    ];
  }

  function generate(p, seed, keep) {
    seed = seed == null ? Math.floor(Math.random() * 1e9) : seed;
    const r = rng(seed);
    const all = allCompetences(p.emploi);
    const comps = all.filter(c => p.competences.includes(c.id));
    const trans = all.filter(c => c.transv && (p.transversales || []).includes(c.id));
    const sc = chooseScenario(r, p.emploi, comps, p.scenarioId);
    const niveau = +p.niveau || 2;
    const role = DATA.roles[p.emploi];
    const nb = +p.nbApprenants || 4;
    const doctr = doctrineFor(r, sc.domaine, p.emploi);
    const msp = {
      version: 1, seed, statut: 'Brouillon à valider par un formateur avant usage',
      emploi: p.emploi, emploiLabel: role.label, niveau, nbApprenants: nb, evolutive: !!p.evolutive,
      competences: comps.concat(trans).map(c => c.id), scenarioId: sc.id, domaine: sc.domaine,
      titre: sc.titre,
      duree: Math.max(15, sc.duree + (niveau - 2) * 5), dureeDebrief: '15 à 20 min',
      objectif: `Vérifier en situation, avec ${nb} stagiaire(s), les compétences visées du ${role.label.toLowerCase()} : ${comps.map(c => c.label.toLowerCase()).join(' ; ')}.`,
      site: sc.site, moyens: sc.moyens.slice(),
      alerte: sc.alerte, arrivee: sc.arrivee, evolution: sc.evolution,
      contraintes: pickContraintes(r, sc.domaine, niveau),
      roles: [
        { role: 'Apprenant', mission: role.apprenant + '. Passage à tour de rôle ou en équipe, les autres observent avec la grille' },
        ...sc.plastrons.map(x => ({ role: 'Plastron : ' + x.role, mission: x.consigne })),
        { role: 'Observateur(s)', mission: 'Remplit la grille : des faits et des heures, sans interpréter. Prévoir 1 observateur pour 2 apprenants au maximum' },
        { role: 'Formateur animateur', mission: 'Joue ' + role.animateur + ', lance la MSP, gère les évènements injectés, peut arrêter l\'exercice' },
        { role: 'Responsable sécurité', mission: 'Seul à pouvoir crier « STOP sécurité ». Peut être le formateur si la MSP est simple' }
      ],
      risques: COMMON_RISKS.concat(sc.risques).map(x => ({ r: x.r, m: x.m })),
      injections: pickInjections(r, sc, niveau, p.evolutive),
      grille: comps.concat(trans).map(c => ({ id: c.id, competence: c.label, bloc: c.bloc, savoirs: c.savoirs.slice(), transv: c.transv })),
      indicateurs: sc.indicateurs.slice(),
      debrief: debrief(comps.concat(trans)),
      suite: SUITE,
      doctrine: doctr
    };
    if (doctr) {
      doctr.risques.forEach(x => msp.risques.push({ r: x.r, m: x.m + ` (${x.src}, p. ${x.p})` }));
      doctr.indicateurs.forEach(x => msp.indicateurs.push(x.t + ` (${x.src}, p. ${x.p})`));
    }
    if (keep) Object.assign(msp, keep);
    return msp;
  }

  window.Engine = { generate, allCompetences, COMMON_RISKS, SUITE };
})();
