/* Historique sur l'appareil (localStorage). Aucune donnée n'est envoyée ailleurs. */
(function () {
  const K = 'msp.history.v1';
  function read() { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch (e) { return []; } }
  function write(a) { try { localStorage.setItem(K, JSON.stringify(a)); return true; } catch (e) { return false; } }
  const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  window.Store = {
    list: () => read().sort((a, b) => b.updatedAt - a.updatedAt),
    get: i => read().find(x => x.id === i),
    save(m) { const a = read(); m.updatedAt = Date.now(); if (!m.id) { m.id = id(); m.createdAt = m.updatedAt; } const k = a.findIndex(x => x.id === m.id); k >= 0 ? a[k] = m : a.push(m); write(a); return m; },
    remove(i) { write(read().filter(x => x.id !== i)); },
    duplicate(i) { const m = read().find(x => x.id === i); if (!m) return null; const c = JSON.parse(JSON.stringify(m)); delete c.id; c.titre += ' (copie)'; return this.save(c); },
    exportAll: () => JSON.stringify(read(), null, 1),
    importAll(txt) { const inc = JSON.parse(txt); if (!Array.isArray(inc)) throw new Error('Fichier invalide'); const a = read(); inc.forEach(m => { if (!a.some(x => x.id === m.id)) a.push(m); }); write(a); return inc.length; }
  };
})();
