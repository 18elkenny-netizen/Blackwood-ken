
const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
	config: {
		name: "uid",
		version: "1.3",
		author: "Samycharles × Gemini",
		role: 0,
		shortDescription: "Carte UID avec avatar (supporte le reply)",
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
			`uid_banner_${uid}_${Date.now()}.png`
		);

		try {
			const name = await usersData.getName(uid) || "Utilisateur";

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

			// Avatar de remplacement
			ctx.save();
			ctx.beginPath();
			ctx.arc(180, 200, 110, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();

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
			ctx.restore();

			// Tentative de récupération de l'avatar Facebook
			try {
				const avatarURL =
					`https://graph.facebook.com/${uid}/picture?width=512&height=512`;

				const response = await axios.get(avatarURL, {
					responseType: "arraybuffer",
					timeout: 10000,
					maxRedirects: 5
				});

				const avatar = await loadImage(Buffer.from(response.data));

				ctx.save();
				ctx.beginPath();
				ctx.arc(180, 200, 110, 0, Math.PI * 2);
				ctx.clip();
				ctx.drawImage(avatar, 70, 90, 220, 220);
				ctx.restore();

			} catch (avatarError) {
				console.log(
					"[UID] Avatar indisponible :",
					avatarError.message
				);
			}

			// Bordure de l'avatar
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
			fs.writeFileSync(bannerPath, canvas.toBuffer("image/png"));

			return api.sendMessage(
				{
					body: `👤 Informations de : ${name}\n🆔 UID : ${uid}`,
					attachment: fs.createReadStream(bannerPath)
				},
				event.threadID,
				() => {
					try {
						fs.unlinkSync(bannerPath);
					} catch (e) {}
				},
				event.messageID
			);

		} catch (err) {
			console.error("[UID ERROR]", err);

			try {
				if (fs.existsSync(bannerPath)) {
					fs.unlinkSync(bannerPath);
				}
			} catch (e) {}

			return api.sendMessage(
				`❌ Impossible de générer la carte : ${err.message}`,
				event.threadID,
				event.messageID
			);
		}
	}
};
