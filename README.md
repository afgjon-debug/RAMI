# 🃏 Rami Familial Cloud

Application web de comptage de points pour le jeu de cartes **Rami** avec synchronisation cloud entre tous les membres de la famille.

## 🌟 Fonctionnalités Principales

### ✅ Actuellement Implémenté

#### 👥 Gestion de la Famille
- **Ajout jusqu'à 8 membres** de la famille
- **Code famille partagé** pour synchroniser les données entre tous les appareils
- **Statistiques individuelles** pour chaque joueur
- **Sélection flexible** de 2 à 6 joueurs par partie

#### 🎮 Gestion des Parties
- **Création de parties** avec joueurs sélectionnés
- **Suivi en temps réel** des manches et scores
- **Règles officielles du Rami** :
  - Points négatifs pour les gagnants (-20 ou -50)
  - Points positifs pour les perdants (cartes restantes)
  - **Friche** : Double tous les points de la manche
  - **Joker** : Double uniquement le score du gagnant
  - **Fin automatique** à 350 points d'écart entre 1er et dernier
  
#### 📊 Statistiques Complètes
- **Classement familial** par moyenne de points (le plus négatif = meilleur)
- **Taux de victoire** par joueur
- **Nombre de parties** jouées et gagnées
- **Manches gagnées** par joueur
- **Meilleur/pire score** de chaque joueur

#### 📚 Historique
- **Archive complète** de toutes les parties terminées
- **Date et heure** de chaque partie
- **Gagnant et participants** affichés
- **Navigation simple** dans l'historique

#### ☁️ Synchronisation Cloud
- **Données stockées** dans le cloud via RESTful API
- **Multi-appareils** - tous les membres peuvent accéder aux mêmes données
- **Rafraîchissement automatique** toutes les 30 secondes
- **Bouton de rafraîchissement manuel** en bas à droite

## 🚀 Démarrage Rapide

### 1️⃣ Première Installation

1. **Ouvrez l'application** sur votre appareil (téléphone, tablette, ordinateur)
2. **Créez un code famille** (ex: `FAMILLE2024`, `DUPONT`, `RAMI8`)
   - Minimum 4 caractères
   - Lettres et chiffres acceptés
   - Sensible à la casse
3. **Partagez ce code** avec tous les membres de la famille

### 2️⃣ Rejoindre la Famille

Chaque membre doit :
1. **Ouvrir l'application** sur son appareil
2. **Entrer le même code famille**
3. **Valider** - les données se synchronisent automatiquement !

### 3️⃣ Ajouter les Joueurs

Dans l'onglet **👥 Famille** :
1. **Entrez le nom** de chaque membre (max 8)
2. **Cliquez sur "+ Ajouter"**
3. Les joueurs apparaissent sur tous les appareils de la famille

### 4️⃣ Démarrer une Partie

1. **Sélectionnez 2 à 6 joueurs** (cliquez sur leurs cartes)
2. **Cliquez sur "🎲 Commencer la Partie"**
3. Passez à l'onglet **🎮 Partie**

### 5️⃣ Jouer et Enregistrer les Manches

Pour chaque manche :
1. **Sélectionnez le gagnant** dans la liste
2. **Choisissez le type** :
   - "Deux fois" = -20 points
   - "D'un coup" = -50 points
3. **Cochez les options** si nécessaire :
   - 🃏 **Avec Joker** : Double le score du gagnant uniquement
   - 🔥 **Friche** : Double tous les scores de la manche
4. **Entrez les points** des perdants (cartes restantes)
5. **Cliquez sur "✅ Enregistrer la Manche"**

### 6️⃣ Fin de Partie

La partie se termine automatiquement quand :
- **L'écart atteint 350 points** entre le 1er et le dernier
- Ou **vous cliquez sur "Terminer"**

Le système :
- 🏆 **Annonce le gagnant** (score le plus négatif)
- 📊 **Met à jour les statistiques** de tous les joueurs
- 📚 **Archive la partie** dans l'historique

## 🎯 Règles du Rami Implémentées

### Points de Base
- ✅ **Gagnant "deux fois"** : -20 points
- ✅ **Gagnant "d'un coup"** : -50 points
- ✅ **Perdants** : +points des cartes restantes

### Règles Spéciales
- 🔥 **Friche** : Multiplie TOUS les scores par 2
- 🃏 **Joker** : Multiplie le score du GAGNANT par 2
- ⚡ **Cumul** : Friche + Joker = ×4 pour le gagnant, ×2 pour les autres

### Fin de Partie
- 🏁 **Écart de 350 points** entre 1er et dernier
- 🥇 **Gagnant** = Score le plus NÉGATIF (le moins de points)
- 🥈 **Classement** = Du plus négatif au plus positif

### Exemples

#### Manche Normale
- Gagnant (d'un coup) : **-50 pts**
- Perdant 1 (15 cartes) : **+15 pts**
- Perdant 2 (22 cartes) : **+22 pts**

#### Manche avec Friche
- Gagnant (deux fois) : **-40 pts** (-20 × 2)
- Perdant 1 (10 cartes) : **+20 pts** (10 × 2)
- Perdant 2 (18 cartes) : **+36 pts** (18 × 2)

#### Manche avec Joker
- Gagnant (d'un coup) : **-100 pts** (-50 × 2)
- Perdant 1 (12 cartes) : **+12 pts**
- Perdant 2 (25 cartes) : **+25 pts**

#### Manche Friche + Joker
- Gagnant (d'un coup) : **-200 pts** (-50 × 2 × 2)
- Perdant 1 (8 cartes) : **+16 pts** (8 × 2)
- Perdant 2 (14 cartes) : **+28 pts** (14 × 2)

## 📱 Utilisation Multi-Appareils

### Scénarios d'Usage

#### 🏠 **À la Maison**
- **Papa** ajoute une manche depuis son téléphone
- **Maman** voit la manche sur sa tablette (après rafraîchissement)
- **Les enfants** suivent les scores depuis l'ordinateur

#### 👨‍👩‍👧‍👦 **En Famille**
- Posez une **tablette au centre** de la table
- Chacun peut **saisir ses propres manches**
- Tout le monde voit les **scores en direct**

#### 🌍 **À Distance**
- **Papa joue** avec des amis le soir
- **Maman vérifie** qui gagne depuis son travail
- Les **statistiques se mettent à jour** automatiquement

### Synchronisation

- ⚡ **Auto-refresh** : Toutes les 30 secondes
- 🔄 **Bouton manuel** : Cliquez sur le bouton en bas à droite
- 📡 **Indicateur** : Point vert en haut à droite = connecté

### Conseils

1. **Créez des favoris** sur tous vos appareils
2. **Activez les notifications** (optionnel)
3. **Rafraîchissez régulièrement** pour voir les dernières manches
4. **Partagez le code famille** via SMS, email ou note familiale

## 📊 Statistiques Disponibles

### Par Joueur
- 🎮 **Parties jouées**
- 🏆 **Parties gagnées**
- 📈 **Taux de victoire** (%)
- 🎯 **Manches gagnées**
- 📊 **Total de points** (cumulé)
- ⬇️ **Meilleur score** (le plus négatif)
- ⬆️ **Pire score** (le plus positif)
- 📉 **Moyenne par partie**

### Générales
- 📚 **Total de parties** jouées par la famille
- 👥 **Nombre de joueurs** actifs
- 🏆 **Classement familial** (meilleur = score moyen le plus négatif)

## 🔧 Architecture Technique

### Technologies Utilisées
- **HTML5** - Structure sémantique
- **CSS3** - Design responsive avec gradients et animations
- **JavaScript ES6+** - Logique applicative et gestion d'état
- **RESTful Table API** - Stockage cloud et synchronisation

### Base de Données Cloud

#### Table `famille`
- `id` : ID unique du joueur
- `nom` : Nom du joueur
- `code_famille` : Code de synchronisation
- `actif` : Statut actif/inactif

#### Table `parties`
- `id` : ID unique de la partie
- `code_famille` : Code famille
- `date_debut` : Date de début
- `date_fin` : Date de fin
- `joueurs` : Liste des participants
- `status` : `en_cours` ou `termine`
- `gagnant` : Nom du gagnant

#### Table `manches`
- `id` : ID unique de la manche
- `partie_id` : ID de la partie parente
- `numero_manche` : Numéro de la manche
- `gagnant` : Gagnant de la manche
- `type_victoire` : `deux_fois` ou `un_coup`
- `avec_joker` : Booléen
- `friche` : Booléen
- `scores` : JSON des scores par joueur

#### Table `statistiques`
- `id` : ID unique
- `code_famille` : Code famille
- `joueur` : Nom du joueur
- `parties_jouees` : Nombre de parties
- `parties_gagnees` : Nombre de victoires
- `manches_gagnees` : Manches gagnées
- `total_points` : Total cumulé
- `meilleur_score` : Meilleur score
- `pire_score` : Pire score

### API Endpoints Utilisés

```javascript
// List players
GET tables/famille?search=CODE_FAMILLE&limit=100

// Create player
POST tables/famille
Body: { nom, code_famille, actif }

// Delete player
DELETE tables/famille/{id}

// Create game
POST tables/parties
Body: { code_famille, date_debut, joueurs, status }

// Update game
PUT tables/parties/{id}
Body: { ...game, status, gagnant }

// Create manche
POST tables/manches
Body: { partie_id, numero_manche, gagnant, type_victoire, avec_joker, friche, scores }

// Update statistics
PUT tables/statistiques/{id}
Body: { ...stats, parties_jouees, parties_gagnees, etc. }
```

## 🎨 Fonctionnalités UI/UX

### Design Responsive
- 📱 **Mobile First** - Optimisé pour téléphones
- 💻 **Desktop Ready** - Adapté aux grands écrans
- 📐 **Grille Flexible** - S'adapte à tous les formats

### Animations
- ✨ **Transitions fluides** entre les onglets
- 🎊 **Animation de victoire** quand la partie se termine
- 🔄 **Rotation du bouton** de rafraîchissement
- 💚 **Pulse** de l'indicateur de connexion

### Feedback Utilisateur
- 🔔 **Alertes temporaires** pour chaque action
- ⚠️ **Validations** de formulaires
- ✅ **Confirmations** pour les actions importantes
- 🎯 **États visuels** (sélectionné, actif, désactivé)

### Thème
- 🌈 **Gradients colorés** pour un look moderne
- 🎨 **Palette cohérente** violet/rouge/vert
- 📝 **Typographie claire** et lisible
- 🔲 **Cartes arrondies** avec ombres

## 🆕 Fonctionnalités Potentielles (Non Implémentées)

### Améliorations Futures Possibles
- 🔔 **Notifications push** quand quelqu'un joue
- 📸 **Photos de profil** pour les joueurs
- 🎖️ **Badges et achievements** (50 parties, 100 victoires, etc.)
- 📈 **Graphiques** d'évolution des performances
- 🎲 **Mode tournoi** avec brackets
- 💬 **Chat familial** intégré
- 🌍 **Multi-langues** (anglais, espagnol, etc.)
- 🔐 **Authentification** individuelle par joueur
- 📤 **Export PDF** des historiques
- 🎯 **Défis** entre joueurs

### Limitations Actuelles
- ⚠️ **Pas de temps réel instantané** - Nécessite rafraîchissement (auto 30s ou manuel)
- ⚠️ **Pas d'authentification** - Tout le monde avec le code famille peut modifier
- ⚠️ **Pas de suppression** de manches après enregistrement
- ⚠️ **Pas de modification** de parties terminées

## ❓ FAQ

### **Q: Comment changer de code famille ?**
**R:** Cliquez sur "Changer de code" sous le code actuel. ⚠️ Vous perdrez l'accès aux anciennes données.

### **Q: Que faire si je perds mon code famille ?**
**R:** Le code est stocké sur chaque appareil. Vérifiez sur les téléphones/tablettes de la famille.

### **Q: Puis-je jouer hors ligne ?**
**R:** Non, l'application nécessite une connexion internet pour synchroniser les données.

### **Q: Les données sont-elles sécurisées ?**
**R:** Les données sont stockées dans le cloud. Toute personne avec votre code famille peut y accéder.

### **Q: Combien de parties puis-je stocker ?**
**R:** Illimité ! Toutes les parties sont archivées dans l'historique.

### **Q: Puis-je supprimer une manche par erreur ?**
**R:** Non, actuellement les manches ne peuvent pas être supprimées une fois enregistrées.

### **Q: Les statistiques sont-elles automatiques ?**
**R:** Oui ! Elles se mettent à jour automatiquement à la fin de chaque partie.

### **Q: Peut-on jouer à plus de 6 personnes ?**
**R:** Non, le maximum est de 6 joueurs par partie (règle du Rami).

### **Q: Comment savoir qui gagne ?**
**R:** Le gagnant a le score TOTAL le plus NÉGATIF. C'est le but du Rami !

### **Q: Que signifie "Friche" ?**
**R:** C'est quand un joueur a 3 paires de cartes identiques au début. Tous les points de la manche sont doublés.

## 📞 Support

Pour toute question ou problème :
1. **Vérifiez le README** complet
2. **Testez le rafraîchissement** des données
3. **Vérifiez votre connexion** internet
4. **Recréez votre code famille** en dernier recours

## 🎉 Amusez-vous Bien !

Cette application a été créée pour rendre vos soirées Rami encore plus amusantes et compétitives ! 

**Que le meilleur (avec le score le plus négatif) gagne ! 🏆🃏**

---

## 📝 Notes de Version

### Version 1.0.0 - Décembre 2024
- ✅ Première version complète
- ✅ Gestion famille jusqu'à 8 joueurs
- ✅ Parties avec règles officielles Rami
- ✅ Synchronisation cloud multi-appareils
- ✅ Statistiques complètes
- ✅ Historique des parties
- ✅ Design responsive et moderne
- ✅ Règles spéciales : Friche et Joker
- ✅ Fin automatique à 350 points d'écart

---

**Développé avec ❤️ pour les familles qui aiment le Rami !**
