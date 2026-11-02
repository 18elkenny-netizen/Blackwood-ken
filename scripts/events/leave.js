
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "leave",
    version: "3.2.0 DARK SYSTEM",
    author: "Shade × Gemini",
    category: "events"
  },

  langs: {
    en: {
      session1: "Matin",
      session2: "Midi",
      session3: "Après-midi",
      session4: "Soirée",
      leaveType1: "a quitté volontairement",
      leaveType2: "s'est fait expulser de",

      defaultLeaveMessage:
`☠️ 𓆩 DARK SYSTEM : LOGOUT PROTOCOL 𓆪 ☠️
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Utilisateur : {userName}
🚪 Statut : {type}

🏴 Groupe : {threadName}
⏰ Heure : {time}
🌙 Session : {session}

💀 DARK SYSTEM ROAST :
{roast}

━━━━━━━━━━━━━━━━━━━━━━━━━━
𓆩 Le système a enregistré cette disparition. 𓆪`
    }
  },

  onStart: async function ({
    threadsData,
    message,
    event,
    api,
    usersData,
    getLang
  }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);

    if (
      threadData &&
      threadData.settings &&
      threadData.settings.sendLeaveMessage === false
    ) return;

    const { leftParticipantFbId } = event.logMessageData;
    const botID = api.getCurrentUserID();

    if (!leftParticipantFbId || leftParticipantFbId == botID) return;

    // ROASTS POUR LES DÉPARTS VOLONTAIRES
    const voluntaryRoasts = [
      "Tu as quitté le groupe comme si quelqu'un allait te retenir. Personne n'a bougé. 💀",
      "Déconnexion réussie. Ton absence vient d'améliorer l'ambiance. ☠️",
      "Même ton Wi-Fi avait plus de présence que toi ici. 📡",
      "Tu pars en silence, c'est probablement ta meilleure contribution au groupe. 🖤",
      "Le groupe vient de perdre un membre... mais pas son intelligence collective. 💀",
      "Tu pensais laisser un grand vide ? Même les notifications ne vont pas te chercher. 🥀",
      "Quitter le groupe était peut-être ta décision la plus intelligente. Enfin une. ☠️",
      "Ton départ a été enregistré. L'émotion générale est actuellement introuvable. 🪦",
      "Tu es parti ? Le groupe va essayer de survivre à cette tragédie inexistante. 🖤",
      "Le bouton Quitter vient de faire son meilleur travail aujourd'hui. 🚪"
    ];

    // ROASTS POUR LES PERSONNES EXPULSÉES
    const kickedRoasts = [
      "EXPULSION CONFIRMÉE. Même le groupe a décidé de ne plus supporter tes performances. ☠️",
      "Tu n'as pas quitté le groupe, on t'a gentiment montré la sortie. 🚪",
      "Accès révoqué. Ton abonnement à la mauvaise ambiance est terminé. 💀",
      "Le personnel a pris une décision : moins de bruit, plus de paix. 🖤",
      "Tu viens de découvrir que le bouton retirer n'était pas décoratif. 🥀",
      "Fin de session forcée. Même ton invitation semble regretter son existence. ☠️",
      "Le groupe a voté avec ses actions. Résultat : dehors. 💀",
      "Ton séjour prend fin. Merci de ne pas revenir avec le même logiciel défectueux. 🪦",
      "Dossier clôturé. La tranquillité du groupe vient d'être restaurée. 🖤",
      "Tu as été expulsé. Même la porte n'a pas eu besoin de te retenir. 🚪"
    ];

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const threadName = threadInfo.threadName || "Secteur Inconnu";
      const memberCount = threadInfo.participantIDs
        ? threadInfo.participantIDs.length
        : 0;

      const userName =
        await usersData.getName(leftParticipantFbId) || "Utilisateur inconnu";

      const date = new Date();
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const timeFormatted = `${hours}:${minutes}`;

      // Déterminer le type de départ
      const isVoluntary = leftParticipantFbId == event.author;

      const type = isVoluntary
        ? getLang("leaveType1")
        : getLang("leaveType2");

      // Choisir une insulte aléatoire
      const roastList = isVoluntary
        ? voluntaryRoasts
        : kickedRoasts;

      const roast = roastList[
        Math.floor(Math.random() * roastList.length)
      ];

      let leaveMessage = getLang("defaultLeaveMessage");

      leaveMessage = leaveMessage
        .replace(/\{userName\}|\{userNameTag\}/g, userName)
        .replace(/\{type\}/g, type)
        .replace(/\{threadName\}|\{boxName\}/g, threadName)
        .replace(/\{time\}/g, timeFormatted)
        .replace(/\{session\}/g,
          hours <= 10
            ? getLang("session1")
            : hours <= 12
              ? getLang("session2")
              : hours <= 18
                ? getLang("session3")
                : getLang("session4")
        )
        .replace(/\{roast\}/g, roast);

      const form = {
        body: leaveMessage,
        mentions: [
          {
            tag: userName,
            id: leftParticipantFbId
          }
        ]
      };

      // Avatar Facebook sans token privé exposé
      const userAvatar =
        `https://graph.facebook.com/${leftParticipantFbId}/picture?width=400&height=400`;

      const backgroundUrl =
        "https://i.ibb.co/4YBNyvP/images-76.jpg";

      // API de génération de la carte d'adieu
      const apiUrl =
        `https://zetbot-page.onrender.com/api/goodbye?pp=${encodeURIComponent(userAvatar)}&nama=${encodeURIComponent(userName)}&bg=${encodeURIComponent(backgroundUrl)}&member=${memberCount}`;

      const tmp = path.join(__dirname, "..", "cache");
      await fs.ensureDir(tmp);

      const imagePath = path.join(
        tmp,
        `leave_${leftParticipantFbId}_${Date.now()}.png`
      );

      try {
        const response = await axios.get(apiUrl, {
          responseType: "arraybuffer",
          timeout: 15000
        });

        await fs.writeFile(imagePath, response.data);

        form.attachment = fs.createReadStream(imagePath);

      } catch (apiErr) {
        console.error(
          "[DARK SYSTEM] Erreur carte d'adieu :",
          apiErr.message
        );
      }

      await message.send(form);

      // Nettoyage du fichier temporaire
      setTimeout(async () => {
        try {
          if (await fs.pathExists(imagePath)) {
            await fs.remove(imagePath);
          }
        } catch (error) {
          console.error("[DARK SYSTEM] Nettoyage impossible :", error.message);
        }
      }, 10000);

    } catch (err) {
      console.error("[DARK SYSTEM] Leave event error :", err);
    }
  }
};
