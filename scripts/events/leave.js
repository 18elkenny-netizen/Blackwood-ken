
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "leave",
		version: "4.0.0 DARK SYSTEM",
		author: "Shade × ChatGPT",
		category: "events"
	},

	langs: {
		en: {
			session1: "MATIN",
			session2: "MIDI",
			session3: "APRÈS-MIDI",
			session4: "SOIRÉE"
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

		const threadID = event.threadID;
		const uid = event.logMessageData?.leftParticipantFbId;

		if (!uid) return;

		const botID = api.getCurrentUserID();

		if (String(uid) === String(botID)) return;

		let imagePath = null;

		const voluntaryRoasts = [
			"Tu as quitté le groupe comme si quelqu'un allait te retenir. Personne n'a bougé. 💀",
			"Déconnexion réussie. Ton absence vient d'améliorer l'ambiance. ☠️",
			"Même ton Wi-Fi avait plus de présence que toi ici. 📡",
			"Tu pars en silence. C'est probablement ta meilleure contribution. 🖤",
			"Un membre en moins, mais la paix reste intacte. 🥀",
			"Tu pensais laisser un grand vide ? Même les notifications ne vont pas te chercher. 💀",
			"Quitter le groupe était peut-être ta décision la plus intelligente. ☠️",
			"Ton départ a été enregistré. L'émotion générale est introuvable. 🪦",
			"Le groupe va tenter de survivre à cette tragédie inexistante. 🖤",
			"Le bouton Quitter vient de faire son meilleur travail aujourd'hui. 🚪"
		];

		const kickedRoasts = [
			"EXPULSION CONFIRMÉE. Le groupe a décidé de ne plus supporter tes performances. ☠️",
			"Tu n'as pas quitté le groupe. On t'a montré la sortie. 🚪",
			"Accès révoqué. Ton abonnement à la mauvaise ambiance est terminé. 💀",
			"Le personnel a pris une décision : moins de bruit, plus de paix. 🖤",
			"Tu viens de découvrir que le bouton Retirer n'était pas décoratif. 🥀",
			"Fin de session forcée. Même ton invitation regrette son existence. ☠️",
			"Le groupe a voté avec ses actions. Résultat : dehors. 💀",
			"Ton séjour prend fin. Merci de ne pas revenir avec le même logiciel défectueux. 🪦",
			"Dossier clôturé. La tranquillité du groupe vient d'être restaurée. 🖤",
			"Tu as été expulsé. Même la porte n'a pas eu besoin de te retenir. 🚪"
		];

		try {
			// Vérifier les paramètres du groupe
			const threadData = await threadsData.get(threadID);

			if (threadData?.settings?.sendLeaveMessage === false) {
				return;
			}

			// Déterminer si le membre est parti volontairement
			const isVoluntary =
				String(uid) === String(event.author);

			const status = isVoluntary
				? "DÉPART VOLONTAIRE"
				: "ACCÈS RÉVOQUÉ";

			// Récupérer le profil Facebook
			let profile = {};

			try {
				const userInfo = await new Promise((resolve, reject) => {
					let finished = false;

					const timer = setTimeout(() => {
						if (!finished) {
							finished = true;
							reject(new Error("Délai dépassé"));
						}
					}, 12000);

					api.getUserInfo(uid, (err, info) => {
						if (finished) return;

						finished = true;
						clearTimeout(timer);

						if (err) return reject(err);

						resolve(info);
					});
				});

				profile = userInfo?.[uid] || {};
			} catch (error) {
				console.log(
					"[DARK SYSTEM] getUserInfo :",
					error.message
				);
			}

			// Récupérer le nom du joueur
			let userName =
				profile.name ||
				profile.fullName ||
				null;

			if (!userName) {
				try {
					userName = await usersData.getName(uid);
				} catch (error) {
					console.log(
						"[DARK SYSTEM] usersData :",
						error.message
					);
				}
			}

			userName = userName || "Utilisateur inconnu";

			// URL de la photo de profil
			const userAvatar =
				profile.thumbSrc ||
				profile.profilePic ||
				profile.photoUrl ||
				`https://graph.facebook.com/${uid}/picture?width=512&height=512`;

			// Récupérer les informations du groupe
			let threadName =
				threadData?.threadName || "SECTEUR INCONNU";

			let memberCount = 0;

			try {
				const threadInfo = await api.getThreadInfo(threadID);

				threadName =
					threadInfo.threadName || threadName;

				memberCount =
					threadInfo.participantIDs?.length || 0;
			} catch (error) {
				console.log(
					"[DARK SYSTEM] ThreadInfo :",
					error.message
				);
			}

			// Heure et session
			const date = new Date();
			const hours = date.getHours();

			const minutes = String(date.getMinutes()).padStart(2, "0");

			const time =
				`${String(hours).padStart(2, "0")}:${minutes}`;

			const session =
				hours <= 10
					? getLang("session1")
					: hours <= 12
						? getLang("session2")
						: hours <= 18
							? getLang("session3")
							: getLang("session4");

			// Roast aléatoire
			const roastList = isVoluntary
				? voluntaryRoasts
				: kickedRoasts;

			const roast =
				roastList[Math.floor(Math.random() * roastList.length)];

			// Message final
			const leaveMessage =
`☠️ 𓆩 𝐃𝐀𝐑𝐊 𝐒𝐘𝐒𝐓𝐄𝐌 𓆪 ☠️
       ⛧ 𝐋𝐎𝐆𝐎𝐔𝐓 𝐏𝐑𝐎𝐓𝐎𝐂𝐎𝐋 ⛧

━━━━━━━━━━━━━━━━━━━━━━━━━━

𓆩 🩸 𓆪 𝐌𝐄𝐌𝐁𝐄𝐑 𝐃𝐄𝐏𝐀𝐑𝐓𝐔𝐑𝐄

👤 𝐉𝐎𝐔𝐄𝐔𝐑 : ${userName}
🆔 𝐔𝐈𝐃 : ${uid}

🚪 𝐒𝐓𝐀𝐓𝐔𝐓 : 「 ${status} 」

━━━━━━━━━━━━━━━━━━━━━━━━━━

🏴 𝐆𝐑𝐎𝐔𝐏𝐄
༆𝗧𝗘𝗦𝗧 ᭄ 𝗜𝗔 ༆
${threadName}

👥 𝐌𝐄𝐌𝐁𝐑𝐄𝐒 𝐑𝐄𝐒𝐓𝐀𝐍𝐓𝐒 : ${memberCount}
⏰ 𝐇𝐄𝐔𝐑𝐄 : ${time}
🌙 𝐒𝐄𝐒𝐒𝐈𝐎𝐍 : ${session}

━━━━━━━━━━━━━━━━━━━━━━━━━━

☠️ 𓆩 𝐃𝐀𝐑𝐊 𝐒𝐘𝐒𝐓𝐄𝐌 : 𝐑𝐎𝐀𝐒𝐓 𓆪

『 ${roast} 』

━━━━━━━━━━━━━━━━━━━━━━━━━━

𓆩 🥀 𝐃𝐎𝐒𝐒𝐈𝐄𝐑 𝐃𝐄 𝐃𝐄𝐏𝐀𝐑𝐓 𝐄𝐍𝐑𝐄𝐆𝐈𝐒𝐓𝐑É 🥀 𓆪

       ☠️ 𝐃𝐀𝐑𝐊 𝐒𝐘𝐒𝐓𝐄𝐌 ☠️
          𝐒𝐔𝐑𝐕𝐄𝐈𝐋𝐋𝐀𝐍𝐂𝐄 𝐀𝐂𝐓𝐈𝐕𝐄`;

			const form = {
				body: leaveMessage,
				mentions: [
					{
						tag: userName,
						id: uid
					}
				]
			};

			// Générer la carte d'adieu
			const backgroundUrl =
				"https://i.ibb.co/4YBNyvP/images-76.jpg";

			const apiUrl =
				`https://zetbot-page.onrender.com/api/goodbye?pp=${encodeURIComponent(userAvatar)}&nama=${encodeURIComponent(userName)}&bg=${encodeURIComponent(backgroundUrl)}&member=${memberCount}`;

			const cacheDir = path.join(__dirname, "..", "cache");

			await fs.ensureDir(cacheDir);

			imagePath = path.join(
				cacheDir,
				`leave_${uid}_${Date.now()}.png`
			);

			try {
				const response = await axios.get(apiUrl, {
					responseType: "arraybuffer",
					timeout: 20000,
					headers: {
						"User-Agent": "Mozilla/5.0"
					}
				});

				await fs.writeFile(imagePath, response.data);

				form.attachment = fs.createReadStream(imagePath);

			} catch (error) {
				console.error(
					"[DARK SYSTEM] Erreur carte :",
					error.message
				);
			}

			// Envoyer le message
			await message.send(form);

			console.log(
				`[DARK SYSTEM] ${userName} (${uid}) : ${status}`
			);

			// Nettoyer le fichier après l'envoi
			if (imagePath) {
				setTimeout(async () => {
					try {
						await fs.remove(imagePath);
					} catch (error) {
						console.error(
							"[DARK SYSTEM] Nettoyage :",
							error.message
						);
					}
				}, 15000);
			}

		} catch (error) {
			console.error(
				"[DARK SYSTEM] Leave event error :",
				error
			);

			if (imagePath) {
				try {
					await fs.remove(imagePath);
				} catch (e) {}
			}
		}
	}
};
