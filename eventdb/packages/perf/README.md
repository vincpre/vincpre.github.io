# @eventdb/perf

Ce package permet de mesurer les performances des fonctions.

## Fonctionnalités
- Calcul du temps moyen d'exécution d'une fonction
- Calcul du temps moyen de traitement d'une unité, par fonction
- Regroupement par context d'exécution, par exemple par fichier
- Affichage de la RAM max utilisée
- Affichage du CPU moyen utilisé
- Débranchable en production via variable d'environnement (`PRINT_PERF`)

## Variables d'environnement

| Nom | Description | Valeur par défaut |
| -- | -- | -- |
| `PRINT_PERF` | Affiche les informations de performances si positionnée à `1` | `` |

## API
- `timer` - objet relatif à l'appel des timers de fonctions
  * `timer.start(<nom>, <contexte>)` - démarre un timer
  * `timer.stop(<nom>, <contexte>` - met un timer en **pause**
  * `timer.addUnits(<nom>, <contexte>, <nombre>)` - ajoute `nombre` d'unités pour le calcul du temps par unité
  * `timer.clear(<nom>, <contexte>)` - efface le timer et retourne ses informations
  * `timer.clearAll()` - efface tous les timers connus et retourne leurs informations dans un tableau
- `printPerf` - affiche les informations de RAM max et de CPU moyen utilisé du début du traitement jusqu'à l'appel de cette fonction. Cette fonction appel également `timer.clearAll()` et affiche, sous forme de tableau, toutes les informations relatives aux timers.
