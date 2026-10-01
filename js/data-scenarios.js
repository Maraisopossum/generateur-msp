/* Banque de scénarios : BROUILLONS à valider par un formateur avant usage.
   Chaque scénario décrit une situation, jamais la technique : les gestes et la doctrine renvoient aux guides (GDO, GTO) et aux RTN en vigueur. */
window.DATA = window.DATA || {};

DATA.domaines = {
  incendie: 'Lutte contre l\'incendie',
  suap: 'Secours d\'urgence aux personnes',
  routier: 'Secours routier',
  protection: 'Protection des personnes, des biens et de l\'environnement'
};

DATA.contraintes = {
  general: [
    'Faible luminosité (éclairage réduit ou nuit)',
    'Météo dégradée (pluie, vent)',
    'Bruit ambiant qui gêne les échanges',
    'Information contradictoire donnée par le requérant',
    'Entourage anxieux ou intrusif',
    'Moyens limités : un matériel est indisponible et doit être remplacé',
    'Message radio brouillé : il faut le faire répéter'
  ],
  incendie: ['Accès difficile (étage, escalier étroit)', 'Point d\'eau éloigné de l\'engin'],
  suap: ['Domicile encombré', 'Plusieurs proches donnent des avis différents', 'Patient peu coopératif'],
  routier: ['Circulation dense à proximité', 'Véhicule dans une position instable'],
  protection: ['Nombreux riverains', 'Accès restreint pour les engins']
};

/* niveau d'injection : 1 simple, 2 moyen, 3 exigeant */
DATA.scenarios = [
  /* ===== INCENDIE ===== */
  {
    id: 'inc-cuisine', domaine: 'incendie', emplois: ['equipier', 'chef_equipe', 'chef_agres_1'],
    titre: 'Feu de cuisine, occupant en difficulté', duree: 25,
    site: 'Appartement ou local d\'entraînement (cuisine, séjour, couloir), fumée froide uniquement',
    moyens: ['Engin d\'incendie', 'Établissements d\'attaque et d\'alimentation', 'EPI et ARI contrôlés', 'Générateur de fumée froide', 'Mannequin ou plastron (occupant)', 'Moyen de transmission d\'exercice'],
    alerte: '« Feu de cuisine au 2e étage. L\'occupant signale de la fumée dans l\'appartement et dit ne plus pouvoir sortir de la cuisine. »',
    arrivee: 'Fumée froide dans la cuisine et le couloir. Un occupant se trouve dans le séjour, conscient, il tousse. Une casserole noircie est sur la plaque, le tableau électrique est dans l\'entrée.',
    evolution: 'La fumée s\'épaissit si l\'engagement tarde. Si la reconnaissance est faite et l\'occupant pris en compte, la situation se stabilise.',
    plastrons: [{ role: 'Occupant', consigne: 'Reste dans le séjour, répond aux questions (« j\'ai laissé une casserole sur le feu »), tousse davantage si personne ne s\'occupe de lui.' }],
    risques: [
      { r: 'Fumée : seule la fumée froide est utilisée, aucun feu réel', m: 'Local contrôlé avant l\'exercice, détecteurs informés, ventilation prévue' },
      { r: 'Sol glissant (eau)', m: 'Balisage, chaussures adaptées, point de passage sécurisé' },
      { r: 'Engagement en milieu enfumé', m: 'EPI et ARI contrôlés, contrôle croisé, responsable sécurité à l\'entrée du local' }
    ],
    injections: [
      { n: 1, t: 'à 5 min', e: 'L\'occupant tousse fortement et demande à sortir.', a: 'Prise en compte de l\'impliqué et mise en sécurité' },
      { n: 2, t: 'dès que le binôme entre', e: 'Un voisin arrive sur le palier et veut récupérer son chat.', a: 'Gestion de l\'entourage, maintien du périmètre' },
      { n: 3, t: 'si la reconnaissance n\'est pas faite', e: 'La fumée gagne le couloir (davantage de fumée froide).', a: 'Reconnaissance, adaptation des moyens' }
    ],
    indicateurs: ['Annonce le nombre d\'impliqués et leur localisation avant l\'engagement', 'Réalise le contrôle croisé de l\'équipement avant d\'engager', 'Garde le contact avec son binôme (vocal ou physique)', 'Rend compte de la situation avant de lancer l\'extinction']
  },
  {
    id: 'inc-appart-sauvetage', domaine: 'incendie', emplois: ['chef_equipe', 'chef_agres_1', 'chef_agres_te'],
    titre: 'Feu d\'appartement avec sauvetage', duree: 35,
    site: 'Bâtiment d\'entraînement ou immeuble mis à disposition (palier, escalier, appartement), fumée froide',
    moyens: ['Engin d\'incendie', 'Échelle ou accès par escalier', 'Établissements d\'attaque et d\'alimentation', 'EPI et ARI contrôlés', 'Générateur de fumée froide', 'Mannequin (victime)', 'Moyen de transmission d\'exercice'],
    alerte: '« Feu dans un appartement du 3e étage. Les occupants n\'ont pas tous évacué, une personne serait restée dans une chambre. »',
    arrivee: 'Fumée froide sur le palier et dans l\'appartement. Une famille est sur le trottoir : elle indique une personne âgée restée dans une chambre. La porte de l\'appartement est fermée.',
    evolution: 'Si la reconnaissance et le sauvetage sont menés en premier, la situation reste maîtrisée. Si l\'attaque précède la recherche, l\'évolution est aggravée (fumée plus dense, victime plus difficile à localiser).',
    plastrons: [
      { role: 'Voisin sur le trottoir', consigne: 'Donne des informations imprécises (« elle est dans la chambre, ou le salon ») et les corrige si on lui pose des questions précises.' },
      { role: 'Victime (mannequin ou plastron)', consigne: 'Dans la chambre, inconsciente ou peu réactive selon la consigne de l\'animateur.' }
    ],
    risques: [
      { r: 'Progression en milieu enfumé', m: 'Contrôle croisé, binôme, ligne guide ou de vie selon la doctrine locale, responsable sécurité à l\'entrée' },
      { r: 'Travail en hauteur (escalier, échelle)', m: 'Matériel vérifié, personnel de sécurité à proximité, équipement adapté' },
      { r: 'Manutention d\'une victime (mannequin)', m: 'Consignes de manutention, personnel suffisant, zone dégagée' }
    ],
    injections: [
      { n: 1, t: 'à 4 min', e: 'Le voisin affirme qu\'une deuxième personne est restée dans l\'appartement.', a: 'Vérification des informations, adaptation de la recherche' },
      { n: 2, t: 'dès que le binôme entre', e: 'Message radio du binôme : « visibilité nulle, nous ne retrouvons plus la porte ».', a: 'Gestion de l\'engagement, sécurisation du binôme' },
      { n: 3, t: 'si la victime est sortie', e: 'La victime est inconsciente, un proche panique et tente de la rejoindre.', a: 'Prise en charge de la victime, gestion de l\'entourage' }
    ],
    indicateurs: ['Fait réaliser la reconnaissance avant toute progression', 'Annonce l\'ordre de recherche et de sauvetage à l\'équipe', 'Contrôle l\'engagement des binômes (heure d\'entrée, pression)', 'Transmet un message de situation complet au COS']
  },
  {
    id: 'inc-poubelles', domaine: 'incendie', emplois: ['equipier', 'chef_equipe'],
    titre: 'Feu de poubelles contre une façade', duree: 20,
    site: 'Cour ou parking avec bacs à déchets simulés (palettes, cartons), sans feu réel ou feu contrôlé par le responsable du site',
    moyens: ['Engin d\'incendie', 'Établissement d\'attaque', 'EPI', 'Fumigène ou fumée froide', 'Fenêtres et façade du bâtiment (simulées)'],
    alerte: '« Feu de poubelles dans la cour d\'un immeuble, les flammes touchent la façade. »',
    arrivee: 'Quatre bacs fument contre un mur. La fumée monte vers une fenêtre ouverte au 1er étage. Des habitants regardent depuis les balcons.',
    evolution: 'La fumée entre dans l\'appartement du 1er si le feu n\'est pas rapidement maîtrisé ou si la protection n\'est pas organisée.',
    plastrons: [{ role: 'Habitant du 1er étage', consigne: 'Se penche à la fenêtre, demande s\'il peut rester chez lui, hésite à sortir.' }],
    risques: [
      { r: 'Feu réel (si utilisé)', m: 'Foyer limité et contrôlé par le responsable du site, moyens d\'extinction à portée, aucun produit inflammable ajouté' },
      { r: 'Fumées', m: 'Placement au vent, zone dégagée, EPI' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'Un riverain s\'approche du feu pour prendre une photo.', a: 'Mise en place d\'un périmètre de sécurité' },
      { n: 2, t: 'dès que la lance est établie', e: 'L\'habitant du 1er étage demande à sortir.', a: 'Prise en compte et information de l\'impliqué' }
    ],
    indicateurs: ['Établit un périmètre avant d\'attaquer', 'Protège la façade et le risque de propagation', 'Rend compte de la fin de l\'extinction et de la surveillance']
  },
  {
    id: 'inc-vehicule', domaine: 'incendie', emplois: ['equipier', 'chef_equipe', 'chef_agres_1'],
    titre: 'Feu de véhicule en bordure de voie', duree: 20,
    site: 'Parking ou voie fermée, véhicule hors d\'usage ou maquette, fumée froide ou foyer contrôlé',
    moyens: ['Engin d\'incendie', 'Établissement d\'attaque', 'EPI et ARI', 'Véhicule d\'exercice', 'Balisage'],
    alerte: '« Voiture en feu sur la bande d\'arrêt d\'urgence, des automobilistes se sont arrêtés. »',
    arrivee: 'Un véhicule fume côté moteur. Deux automobilistes sont sortis et filment. Un enfant est resté dans une voiture arrêtée juste derrière.',
    evolution: 'Le feu gagne l\'habitacle si le moteur n\'est pas maîtrisé ; la circulation reste dangereuse.',
    plastrons: [{ role: 'Automobiliste', consigne: 'Veut retourner chercher des affaires dans son véhicule, s\'énerve si on lui refuse.' }],
    risques: [
      { r: 'Circulation à proximité', m: 'Balisage de l\'exercice, site fermé ou protégé, tenues haute visibilité' },
      { r: 'Fumées toxiques', m: 'Placement au vent, ARI si engagement' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'Un automobiliste s\'approche du véhicule pour récupérer un sac.', a: 'Maintien du périmètre, gestion de l\'entourage' },
      { n: 2, t: 'quand le moteur est maîtrisé', e: 'Le feu se rallume sous le véhicule.', a: 'Surveillance et adaptation des moyens' }
    ],
    indicateurs: ['Place l\'engin et les intervenants à l\'abri de la circulation', 'Fait établir un périmètre', 'Contrôle l\'absence de reprise avant de déclarer l\'extinction']
  },
  {
    id: 'inc-entrepot', domaine: 'incendie', emplois: ['chef_agres_te'],
    titre: 'Feu de local commercial, plusieurs équipes engagées', duree: 45,
    site: 'Local d\'entraînement ou exercice sur table avec plan, fumée froide si matériel disponible',
    moyens: ['Plusieurs engins (réels ou simulés)', 'Plan du bâtiment', 'Fiches de moyens', 'Radio d\'exercice', 'Tableau de suivi des engagements'],
    alerte: '« Feu dans un local commercial, de la fumée sort de la toiture, des employés seraient encore à l\'intérieur. »',
    arrivee: 'Fumée dense en toiture et à l\'entrée. Le responsable du magasin signale deux personnes non comptées. Le plan est accessible. Deux équipes sont engagées, une troisième arrive.',
    evolution: 'Le feu s\'étend si l\'alimentation hydraulique est insuffisante. L\'évolution dépend de la tactique choisie et du contrôle des engagements.',
    plastrons: [
      { role: 'Responsable du magasin', consigne: 'Donne des informations partielles, doit être questionné, n\'a pas le plan sous la main au début.' },
      { role: 'Chef d\'équipe engagée (radio)', consigne: 'Rend compte uniquement si on l\'interroge ; annonce un problème en cours d\'exercice.' }
    ],
    risques: [
      { r: 'Exercice mal compris (fausse alerte réelle)', m: 'Annonce « exercice » sur chaque message, information du centre de traitement de l\'alerte' },
      { r: 'Engagement réel de moyens', m: 'Exercice sur table ou site dédié, aucun engin ne quitte son affectation sans accord' }
    ],
    injections: [
      { n: 1, t: 'à 6 min', e: 'Une équipe annonce une alimentation en eau insuffisante.', a: 'Dimensionnement et ordre d\'alimentation' },
      { n: 2, t: 'à 10 min', e: 'Deux employés ressortent, un troisième manque.', a: 'Réorientation du sauvetage, point de situation au COS' },
      { n: 3, t: 'si le point de situation n\'est pas fait', e: 'Le centre de traitement de l\'alerte demande un message de renseignements.', a: 'Rendre compte avec un message structuré' }
    ],
    indicateurs: ['Donne un ordre initial structuré (situation, mission, exécution)', 'Contrôle l\'engagement des équipes et leur relève', 'Transmet un message de renseignements complet', 'Adapte la tactique à l\'évolution annoncée']
  },

  /* ===== SUAP ===== */
  {
    id: 'suap-detresse-resp', domaine: 'suap', emplois: ['equipier', 'chef_agres_1'],
    titre: 'Détresse respiratoire à domicile, entourage anxieux', duree: 25,
    site: 'Logement pédagogique ou pièce aménagée (séjour, canapé, table basse)',
    moyens: ['VSAV ou matériel de secours d\'exercice', 'Lot de bilan et de ventilation', 'Plastron (victime)', 'Plastrons (entourage)', 'Fiche de constantes simulées'],
    alerte: '« Homme de 70 ans, essoufflé, difficultés pour parler, sa femme est très inquiète. »',
    arrivee: 'Le patient est assis, en sueur, répond par mots courts. Sa femme parle sans arrêt et donne des informations contradictoires sur ses traitements.',
    evolution: 'Les constantes se dégradent si le bilan et la mise en condition sont retardés ; elles s\'améliorent avec une prise en charge adaptée.',
    plastrons: [
      { role: 'Patient', consigne: 'Parle par mots courts, demande de rester assis, se dégrade selon l\'évolution décidée par l\'animateur.' },
      { role: 'Épouse', consigne: 'Très anxieuse, interrompt l\'équipe, donne des informations contradictoires sur les médicaments.' }
    ],
    risques: [
      { r: 'Manipulation du plastron', m: 'Plastron informé, gestes simulés, jamais de geste invasif réel' },
      { r: 'Pression psychologique sur les stagiaires', m: 'Débriefing prévu, droit de retrait rappelé' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'L\'épouse affirme que son mari ne prend « rien du tout », puis montre une boîte de médicaments.', a: 'Recueil et vérification des antécédents et traitements' },
      { n: 2, t: 'après le premier bilan', e: 'Le patient devient plus pâle et répond moins.', a: 'Réévaluation, adaptation de la prise en charge, demande de moyens' },
      { n: 3, t: 'à 8 min', e: 'Le fils arrive et s\'oppose à l\'évacuation.', a: 'Communication, gestion de l\'entourage' }
    ],
    indicateurs: ['Fait un bilan complet dans l\'ordre prévu par les protocoles en vigueur', 'Rassure le patient et l\'entourage tout en gardant la conduite de l\'action', 'Transmet un bilan structuré à la régulation']
  },
  {
    id: 'suap-acr', domaine: 'suap', emplois: ['equipier', 'chef_agres_1'],
    titre: 'Arrêt cardiaque à domicile, famille présente', duree: 25,
    site: 'Logement pédagogique ou pièce aménagée, mannequin adulte',
    moyens: ['Mannequin de réanimation', 'Défibrillateur d\'entraînement', 'Lot de bilan et de ventilation', 'Chronomètre'],
    alerte: '« Homme de 58 ans inconscient, sa femme pratique un massage sur les conseils du régulateur. »',
    arrivee: 'Le mannequin est au sol, la femme réalise des compressions. Un enfant pleure dans la pièce voisine. L\'appartement est exigu.',
    evolution: 'La situation évolue selon la rapidité et la qualité de la chaîne de réanimation mise en œuvre.',
    plastrons: [{ role: 'Épouse', consigne: 'Épuisée, hésite à laisser sa place, donne l\'heure de l\'arrêt et les antécédents au compte-gouttes.' }],
    risques: [
      { r: 'Contact avec du matériel électrique d\'entraînement', m: 'Défibrillateur d\'entraînement exclusivement, chargeur déconnecté' },
      { r: 'Fatigue physique (compressions)', m: 'Relève planifiée, rappel des signes d\'épuisement' }
    ],
    injections: [
      { n: 1, t: 'à 2 min', e: 'L\'enfant arrive dans la pièce.', a: 'Gestion de l\'entourage sans interrompre la réanimation' },
      { n: 2, t: 'après le choc', e: 'L\'épouse demande si son mari « va s\'en sortir ».', a: 'Communication adaptée' }
    ],
    indicateurs: ['Organise la relève des compressions', 'Respecte la séquence des protocoles en vigueur (RTN 2026)', 'Annonce l\'heure de l\'arrêt et les actions réalisées à la régulation']
  },
  {
    id: 'suap-chute', domaine: 'suap', emplois: ['equipier', 'chef_agres_1'],
    titre: 'Chute d\'une personne âgée, suspicion de traumatisme', duree: 25,
    site: 'Logement pédagogique (salle de bain ou couloir), plastron',
    moyens: ['Plastron', 'Matériel d\'immobilisation d\'exercice', 'Brancard ou moyens de portage', 'Lot de bilan'],
    alerte: '« Dame de 82 ans tombée dans sa salle de bain, douleur à la hanche, ne peut pas se relever. »',
    arrivee: 'Personne au sol dans un espace étroit, douleur à la hanche, tension apparente. Un fils est présent et voudrait la relever lui-même.',
    evolution: 'Le patient se plaint de plus en plus si les gestes sont brusques ; l\'espace complique l\'immobilisation.',
    plastrons: [
      { role: 'Patiente', consigne: 'Se plaint à la mobilisation, répond avec lenteur.' },
      { role: 'Fils', consigne: 'Veut intervenir, doit être canalisé.' }
    ],
    risques: [
      { r: 'Manutention du plastron', m: 'Consignes de manutention, nombre d\'intervenants suffisant, plastron informé' },
      { r: 'Sol mouillé', m: 'Sol sec ou balisé, chaussures adaptées' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'La patiente dit qu\'elle a perdu connaissance avant de tomber.', a: 'Modification du bilan et de la demande de moyens' },
      { n: 2, t: 'au moment du relevage', e: 'Le couloir est trop étroit pour le brancard.', a: 'Adaptation du moyen de portage' }
    ],
    indicateurs: ['Réalise le bilan dans l\'ordre prévu', 'Choisit et justifie le moyen d\'immobilisation et de portage', 'Maintient la communication avec la patiente et son fils']
  },
  {
    id: 'suap-malaise', domaine: 'suap', emplois: ['equipier', 'chef_agres_1'],
    titre: 'Malaise sur la voie publique, public autour', duree: 20,
    site: 'Trottoir ou place, avec figurants',
    moyens: ['Plastron', 'Lot de bilan', 'Moyen de mesure de la glycémie d\'entraînement', 'Figurants (passants)'],
    alerte: '« Homme allongé sur le trottoir, conscient mais confus, un attroupement se forme. »',
    arrivee: 'Un homme assis contre un mur, confus, sueurs. Plusieurs passants donnent des informations différentes, un passant filme.',
    evolution: 'La confusion s\'aggrave si le bilan est retardé ; les passants gênent l\'accès.',
    plastrons: [
      { role: 'Patient', consigne: 'Répond à côté, ne retrouve pas son nom, s\'améliore selon la consigne.' },
      { role: 'Passants', consigne: 'Posent des questions, s\'approchent trop, un d\'eux affirme connaître le patient.' }
    ],
    risques: [
      { r: 'Public non maîtrisé', m: 'Zone d\'exercice délimitée, figurants briefés' },
      { r: 'Circulation proche', m: 'Site protégé' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'Un passant affirme que le patient est diabétique.', a: 'Prise en compte de l\'information, adaptation du bilan' },
      { n: 2, t: 'à 6 min', e: 'Un passant s\'énerve et exige que le patient soit emmené immédiatement.', a: 'Gestion de l\'entourage' }
    ],
    indicateurs: ['Sécurise l\'environnement avant de s\'occuper du patient', 'Vérifie les informations des témoins', 'Transmet un bilan structuré']
  },

  /* ===== SECOURS ROUTIER ===== */
  {
    id: 'rout-avp-2v', domaine: 'routier', emplois: ['equipier', 'chef_agres_1'],
    titre: 'AVP deux véhicules, risque de sur-accident', duree: 30,
    site: 'Parking ou voie fermée avec deux véhicules d\'exercice',
    moyens: ['Engin de secours routier', 'Balisage', 'Tenues haute visibilité', 'Deux véhicules d\'exercice', 'Plastron (victime)'],
    alerte: '« Accident entre deux voitures, une personne se plaint d\'une douleur au thorax, un véhicule fuit. »',
    arrivee: 'Deux véhicules immobilisés, l\'un touché à l\'avant. Une victime consciente au volant, une autre sortie du véhicule. Du liquide au sol, circulation continue de passer.',
    evolution: 'Le risque de sur-accident persiste tant que la zone n\'est pas protégée ; une victime se dégrade selon l\'animateur.',
    plastrons: [
      { role: 'Victime au volant', consigne: 'Douleur au thorax, répond aux questions, panique si on la laisse seule.' },
      { role: 'Conducteur de l\'autre véhicule', consigne: 'Sorti, agité, veut déplacer son véhicule.' }
    ],
    risques: [
      { r: 'Circulation réelle à proximité', m: 'Site fermé ou protégé, signaleur dédié, tenues haute visibilité' },
      { r: 'Fuite de liquide (simulée)', m: 'Aucun produit dangereux réel, eau colorée si besoin' },
      { r: 'Véhicule instable', m: 'Calage, absence de manipulation sous le véhicule' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'Un véhicule arrive vite et freine tard à proximité.', a: 'Protection de la zone, sécurité des intervenants' },
      { n: 2, t: 'après le premier bilan', e: 'La victime signale qu\'elle ne sent plus ses jambes.', a: 'Adaptation de la prise en charge et des moyens' }
    ],
    indicateurs: ['Place l\'engin pour protéger la zone avant toute prise en charge', 'Réalise la balisage selon la procédure', 'Annonce au chef d\'agrès les risques et le nombre de victimes']
  },
  {
    id: 'rout-incarcere', domaine: 'routier', emplois: ['chef_agres_1'],
    titre: 'Victime incarcérée, désincarcération', duree: 40,
    site: 'Plateau d\'entraînement avec véhicule(s) d\'exercice',
    moyens: ['Engin de secours routier', 'Matériel de désincarcération d\'exercice', 'Protection des victimes', 'Balisage', 'Plastron ou mannequin'],
    alerte: '« Une voiture a percuté un mur, le conducteur est coincé dans l\'habitacle. »',
    arrivee: 'Véhicule fortement déformé, conducteur conscient mais coincé. Un passager est sorti, choqué.',
    evolution: 'Le temps de désincarcération est imposé par la stabilité du véhicule et l\'état de la victime.',
    plastrons: [{ role: 'Victime incarcérée', consigne: 'Douleur, inquiétude, demande à connaître la durée.' }],
    risques: [
      { r: 'Matériel de désincarcération', m: 'Équipe formée, protection de la victime, zone d\'action délimitée' },
      { r: 'Batterie et éléments du véhicule', m: 'Véhicule sécurisé, consignes de neutralisation selon la doctrine' }
    ],
    injections: [
      { n: 1, t: 'à 5 min', e: 'Le passager dit qu\'une personne était derrière.', a: 'Vérification, adaptation du dispositif' },
      { n: 2, t: 'pendant la découpe', e: 'La victime perd connaissance.', a: 'Adaptation de la prise en charge et du rythme de l\'opération' }
    ],
    indicateurs: ['Définit la technique avant de commencer', 'Protège la victime pendant l\'opération', 'Coordonne le travail du binôme de désincarcération et de l\'équipe de soin']
  },

  /* ===== PROTECTION / OPÉRATIONS DIVERSES ===== */
  {
    id: 'prot-inondation', domaine: 'protection', emplois: ['equipier', 'chef_agres_1'],
    titre: 'Inondation de cave avec risque électrique', duree: 20,
    site: 'Local technique ou cave d\'entraînement, prises et tableau simulés',
    moyens: ['Moyens d\'épuisement d\'exercice', 'Éclairage', 'Matériel de balisage', 'Équipements de protection adaptés'],
    alerte: '« Cave inondée dans un immeuble, de l\'eau monte vers le tableau électrique. »',
    arrivee: 'Eau stagnante au sol, tableau électrique à hauteur de genou, odeur de moisi. Le gardien est présent et très inquiet.',
    evolution: 'Le risque électrique augmente si l\'eau atteint le tableau.',
    plastrons: [{ role: 'Gardien', consigne: 'Veut aller couper l\'électricité lui-même, hésite à laisser l\'équipe faire.' }],
    risques: [
      { r: 'Risque électrique', m: 'Exercice sans tension, tableau fictif, accès interdit aux zones réelles' },
      { r: 'Glissade', m: 'Chaussures adaptées, éclairage, balisage' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'Le gardien descend à la cave sans prévenir.', a: 'Protection des personnes, sécurisation de la zone' },
      { n: 2, t: 'à 6 min', e: 'Une odeur de gaz est signalée (simulée par message radio).', a: 'Évaluation, demande de renfort, modification du dispositif' }
    ],
    indicateurs: ['Identifie le risque électrique avant tout engagement', 'Délimite la zone et protège le public', 'Rend compte et demande les moyens adaptés']
  },
  {
    id: 'prot-hymenopteres', domaine: 'protection', emplois: ['equipier', 'chef_agres_1'],
    titre: 'Nid d\'hyménoptères en zone sensible', duree: 20,
    site: 'Cour d\'école ou jardin avec nid fictif (maquette)',
    moyens: ['Tenues de protection adaptées', 'Matériel de balisage', 'Maquette de nid', 'Plastrons (public)'],
    alerte: '« Nid de guêpes près de l\'entrée d\'une école, un enfant a déjà été piqué. »',
    arrivee: 'Nid visible au-dessus d\'une porte, quelques insectes simulés, enfants et parents à proximité.',
    evolution: 'Le risque augmente si le public s\'approche.',
    plastrons: [{ role: 'Parent', consigne: 'Veut récupérer son enfant près du nid, demande une réponse immédiate.' }],
    risques: [
      { r: 'Piqûres', m: 'Aucun insecte vivant, maquette uniquement, protection réelle prévue pour l\'équipe' },
      { r: 'Public non maîtrisé', m: 'Périmètre, information des figurants' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'Un enfant dit avoir été piqué et se plaint.', a: 'Prise en charge ou orientation vers un équipier secours' },
      { n: 2, t: 'à 6 min', e: 'Un parent franchit le périmètre.', a: 'Maintien du périmètre, gestion de l\'entourage' }
    ],
    indicateurs: ['Délimite et signale la zone', 'Choisit et justifie l\'équipement de protection', 'Communique avec le public']
  },
  {
    id: 'prot-arbre', domaine: 'protection', emplois: ['equipier', 'chef_equipe', 'chef_agres_1'],
    titre: 'Arbre sur la chaussée après tempête', duree: 20,
    site: 'Voie ou parking fermés, arbre fictif (troncs, branches)',
    moyens: ['Engin tout usage', 'Tronçonneuse d\'exercice (non démarrée) ou outils manuels', 'Balisage', 'Tenues haute visibilité'],
    alerte: '« Arbre en travers d\'une route, une voiture est arrêtée derrière. »',
    arrivee: 'Tronc sur la chaussée, branches sur une ligne téléphonique. Une voiture est arrêtée, deux occupants descendent.',
    evolution: 'Le risque de sur-accident et la ligne au sol imposent une organisation rapide.',
    plastrons: [{ role: 'Automobiliste', consigne: 'Veut déplacer le tronc, s\'approche des câbles.' }],
    risques: [
      { r: 'Circulation', m: 'Site fermé, signaleur, tenues haute visibilité' },
      { r: 'Câbles au sol', m: 'Aucun câble sous tension, ligne fictive' },
      { r: 'Outil de coupe', m: 'Utilisation seulement par un personnel habilité, protection individuelle' }
    ],
    injections: [
      { n: 1, t: 'à 3 min', e: 'Un riverain annonce que la ligne sur le sol est sous tension.', a: 'Évaluation du risque, périmètre, demande de moyens' },
      { n: 2, t: 'à 6 min', e: 'Un véhicule arrive et freine tard.', a: 'Protection de la zone' }
    ],
    indicateurs: ['Balise et protège la zone avant d\'agir', 'Évalue les risques (circulation, câbles, instabilité)', 'Rend compte et organise la remise en circulation']
  }
];

DATA.roles = {
  equipier: { label: 'Équipier', apprenant: 'Équipier au sein d\'une équipe, sous les ordres d\'un chef d\'équipe ou d\'un chef d\'agrès', animateur: 'Chef d\'agrès (le formateur ou un stagiaire)' },
  chef_equipe: { label: 'Chef d\'équipe', apprenant: 'Chef d\'équipe, il commande son équipe sous l\'autorité d\'un chef d\'agrès', animateur: 'Chef d\'agrès (le formateur ou un stagiaire)' },
  chef_agres_1: { label: 'Chef d\'agrès 1 équipe', apprenant: 'Chef d\'agrès, il commande son engin comportant une équipe', animateur: 'COS ou centre de traitement de l\'alerte (le formateur)' },
  chef_agres_te: { label: 'Chef d\'agrès tout engin', apprenant: 'Chef d\'agrès tout engin : il commande plusieurs équipes, seul ou sous l\'autorité d\'un COS', animateur: 'COS ou centre de traitement de l\'alerte (le formateur)' }
};
