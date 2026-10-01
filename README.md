# Générateur de MSP

Application web (PWA) qui prépare une **mise en situation professionnelle** à partir des compétences des référentiels nationaux des sapeurs-pompiers volontaires : équipier, chef d'équipe, chef d'agrès d'un engin comportant une équipe, chef d'agrès tout engin.

Tu choisis un emploi, des compétences, une difficulté et un nombre de stagiaires. L'application assemble une fiche (scénario, rôles, sécurité, évènements injectés, grille d'observation, débriefing), modifiable puis imprimable en PDF. Elle fonctionne hors ligne et garde l'historique dans le navigateur.

## Sources
- Compétences et savoirs-agir : RNAC et RNE nationaux (DGSCGC, 2019).
- Repères de doctrine : guides GDO et GTO nationaux, cités avec leur page.
- Scénarios : brouillons rédigés pour aider la conception, **à valider par un formateur**. Ils ne remplacent ni les guides de doctrine, ni les guides de techniques, ni les RTN en vigueur.

## Options
- Un bouton « IA » (Gemini) peut réécrire le scénario ou proposer des évènements. Il demande **ta propre clé d'API**, gardée dans ton navigateur.

## Utilisation locale
Ouvrir `index.html` suffit, ou servir le dossier avec n'importe quel serveur statique. Aucune donnée personnelle n'est collectée.
