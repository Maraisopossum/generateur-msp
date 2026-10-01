/* Enrichissement optionnel par Gemini. La clé reste dans le navigateur (localStorage) et n'est envoyée qu'à Google. */
(function () {
  const KEY = 'msp.geminiKey', MODEL = 'msp.geminiModel';
  const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-pro-latest'];
  const get = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
  const set = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) {} };

  async function ask(prompt, signal) {
    const key = get(KEY, '');
    if (!key) throw new Error('Aucune clé Gemini : ajoute-la dans Réglages.');
    const first = get(MODEL, MODELS[0]);
    const order = [first].concat(MODELS.filter(m => m !== first));
    let last = '';
    for (let i = 0; i < 4; i++) {
      const model = order[Math.min(i, order.length - 1)];
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST', signal,
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, responseMimeType: 'application/json' } })
        });
        if (res.status === 503 || res.status === 429 || res.status === 500) { last = 'Gemini est surchargé (' + res.status + ')'; await new Promise(r => setTimeout(r, 2500 * (i + 1))); continue; }
        if (!res.ok) throw new Error('Erreur Gemini ' + res.status + ' : ' + (await res.text()).slice(0, 200));
        const j = await res.json();
        const txt = (j.candidates && j.candidates[0] && j.candidates[0].content.parts.map(p => p.text || '').join('')) || '';
        return JSON.parse(txt.replace(/^```(?:json)?\s*|\s*```$/g, ''));
      } catch (e) { if (e.name === 'AbortError') throw e; last = e.message; if (!/surcharg/.test(last)) throw e; }
    }
    throw new Error(last || 'Gemini ne répond pas, réessaie plus tard.');
  }

  function context(m) {
    const comp = m.grille.map(g => `- ${g.competence} (savoirs-agir : ${g.savoirs.join(' ; ')})`).join('\n');
    const doc = m.doctrine && m.doctrine.reperes.length ? '\nRepères de doctrine (GDO/GTO) à respecter :\n' + m.doctrine.reperes.map(x => `- ${x.t} (${x.src}, p. ${x.p})`).join('\n') : '';
    return `Emploi : ${m.emploiLabel}. Domaine : ${DATA.domaines[m.domaine]}. Niveau de difficulté : ${m.niveau}/3. Durée : ${m.duree} min. Stagiaires : ${m.nbApprenants}.
Compétences visées :
${comp}${doc}`;
  }
  const RULES = `Règles : français ; pas de technique opérationnelle détaillée (renvoie aux guides de doctrine et de techniques et aux RTN en vigueur) ; aucune règle de doctrine inventée ; la sécurité des intervenants et des plastrons prime ; situation réaliste pour un exercice ; pas de feu réel, pas de geste invasif réel sur un plastron.`;

  async function rewriteScenario(m) {
    const p = `Tu aides un formateur sapeur-pompier à écrire une mise en situation professionnelle (MSP).\n${context(m)}\n\nScénario actuel :\n- Titre : ${m.titre}\n- Alerte : ${m.alerte}\n- Arrivée : ${m.arrivee}\n- Évolution : ${m.evolution}\n- Contraintes : ${m.contraintes.join(' ; ') || 'aucune'}\n\nPropose une variante originale du scénario, adaptée aux compétences visées. ${RULES}\nRéponds en JSON : {"titre":"...","alerte":"...","arrivee":"...","evolution":"..."}`;
    return ask(p);
  }
  async function proposeInjections(m) {
    const p = `Tu aides un formateur sapeur-pompier à rendre une MSP évolutive.\n${context(m)}\n\nScénario : ${m.titre}. ${m.alerte} ${m.arrivee}\nÉvènements déjà prévus : ${m.injections.map(i => i.e).join(' ; ') || 'aucun'}\n\nPropose ${m.niveau === 3 ? 3 : 2} évènements injectés nouveaux, chacun avec un déclencheur précis (heure, action de l'apprenant ou oubli), l'évènement, et ce que l'on attend de l'apprenant. ${RULES}\nRéponds en JSON : [{"t":"déclencheur","e":"évènement","a":"attendu de l'apprenant"}]`;
    return ask(p);
  }

  window.AI = { getKey: () => get(KEY, ''), setKey: v => set(KEY, v), getModel: () => get(MODEL, MODELS[0]), setModel: v => set(MODEL, v), MODELS, rewriteScenario, proposeInjections };
})();
