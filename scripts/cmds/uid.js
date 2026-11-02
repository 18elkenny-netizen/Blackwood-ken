
const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
	config: {
		name: "uid",
		version: "1.4",
		author: "Samycharles",
		role: 0,
		shortDescription: "Carte UID avec photo de profil",
		category: "utility"
	},

	onStart: async function ({ api, event, usersData }) {
		const uid = event.messageReply
			? event.messageReply.senderID
			: event.senderID;

		const cacheDir = path.join(__dirname, "cache");

		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}

		const bannerPath = path.join(
			cacheDir,
			`uid_${uid}_${Date.now()}.png`
		);

		try {
			const name = await usersData.getName(uid) || "Utilisateur";

			// Récupération des informations Facebook
			let userInfo = null;

			try {
				userInfo = await new Promise((resolve, reject) => {
					const timeout = setTimeout(() => {
						reject(new Error("Délai de récupération du profil dépassé"));
					}, 12000);

					api.getUserInfo(uid, (err, info) => {
						clearTimeout(timeout);

						if (err) return reject(err);

						resolve(info);
					});
				});
			} catch (error) {
				console.log("[UID] Erreur getUserInfo :", error.message);
			}

			// Récupération de l'URL de la photo
			const avatarURL =
				userInfo?.[uid]?.thumbSrc ||
				userInfo?.[uid]?.profilePic ||
				userInfo?.[uid]?.photoUrl ||
				null;

			let avatar = null;

			if (avatarURL) {
				try {
					const response = await axios.get(avatarURL, {
						responseType: "arraybuffer",
						timeout: 15000,
						headers: {
							"User-Agent": "Mozilla/5.0"
						}
					});

					avatar = await loadImage(
						Buffer.from(response.data)
					);

					console.log("[UID] Photo de profil récupérée :", uid);
				} catch (error) {
					console.log(
						"[UID] Impossible de charger la photo :",
						error.message
					);
				}
			} else {
				console.log("[UID] Aucune URL de photo trouvée :", uid);
			}

			// Création de la carte
			const canvas = createCanvas(1200, 400);
			const ctx = canvas.getContext("2d");

			// Fond
			ctx.fillStyle = "#111827";
			ctx.fillRect(0, 0, 1200, 400);

			// Dégradé
			const gradient = ctx.createLinearGradient(0, 0, 1200, 400);
			gradient.addColorStop(0, "#4f46e5");
			gradient.addColorStop(1, "#06b6d4");

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 1200, 400);

			// Cercle de l'avatar
			ctx.save();
			ctx.beginPath();
			ctx.arc(180, 200, 110, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();

			if (avatar) {
				// Photo réelle du joueur
				ctx.drawImage(avatar, 70, 90, 220, 220);
			} else {
				// Avatar de remplacement
				ctx.fillStyle = "#1f2937";
				ctx.fillRect(70, 90, 220, 220);

				ctx.fillStyle = "#ffffff";
				ctx.font = "bold 100px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(
					String(name).charAt(0).toUpperCase(),
					180,
					200
				);
			}

			ctx.restore();

			// Bordure
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 6;
			ctx.beginPath();
			ctx.arc(180, 200, 110, 0, Math.PI * 2);
			ctx.stroke();

			// Informations
			ctx.textAlign = "left";
			ctx.textBaseline = "alphabetic";
			ctx.fillStyle = "#ffffff";

			ctx.font = "bold 48px Arial";
			ctx.fillText(String(name).slice(0, 28), 350, 120);

			ctx.font = "32px Arial";
			ctx.fillText(`UID : ${uid}`, 350, 190);
			ctx.fillText(`Groupe : ${event.threadID}`, 350, 250);

			ctx.fillText(
				`Date : ${new Date().toLocaleDateString("fr-FR")}`,
				350,
				310
			);

			ctx.font = "bold 24px Arial";
			ctx.fillStyle = "rgba(255,255,255,0.75)";
			ctx.fillText("USER INFORMATION CARD", 350, 360);

			// Sauvegarde
			fs.writeFileSync(
				bannerPath,
				canvas.toBuffer("image/png")
			);

			return api.sendMessage(
				{
					body:
						`👤 Informations de : ${name}\n` +
						`🆔 UID : ${uid}`,
					attachment: fs.createReadStream(bannerPath)
				},
				event.threadID,
				() => {
					try {
						fs.unlinkSync(bannerPath);
					} catch (error) {}
				},
				event.messageID
			);

		} catch (err) {
			console.error("[UID ERROR]", err);

			try {
				if (fs.existsSync(bannerPath)) {
					fs.unlinkSync(bannerPath);
				}
			} catch (error) {}

			return api.sendMessage(
				`❌ Impossible de générer la carte : ${err.message}`,
				event.threadID,
				event.messageID
			);
		}
	}
};
