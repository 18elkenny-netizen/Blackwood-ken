
const CATEGORIES = [
	"📢 ANNONCE GÉNÉRALE",
	"🚨 ANNONCE URGENTE",
	"🎉 ANNONCE ÉVÉNEMENTIELLE",
	"⚖️ ANNONCE ADMINISTRATIVE",
	"⚠️ AVERTISSEMENT"
];

const STYLES = [
	"DARK 🖤",
	"ATTENTION 🚨",
	"BLOOD 🩸",
	"CYBER 💠",
	"ROYAL 👑",
	"SOFT 🌙",
	"MINIMALISTE ✦"
];

const STYLE_NAMES = [
	"DARK",
	"ATTENTION",
	"BLOOD",
	"CYBER",
	"ROYAL",
	"SOFT",
	"MINIMALISTE"
];

// Polices Unicode lisibles
const ALPHABETS = {
	DARK: [
		"abcdefghijklmnopqrstuvwxyz",
		"𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"
	],
	ATTENTION: [
		"abcdefghijklmnopqrstuvwxyz",
		"𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳"
	],
	BLOOD: [
		"abcdefghijklmnopqrstuvwxyz",
		"𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"
	],
	CYBER: [
		"abcdefghijklmnopqrstuvwxyz",
		"𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣"
	],
	ROYAL: [
		"abcdefghijklmnopqrstuvwxyz",
		"𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"
	],
	SOFT: [
		"abcdefghijklmnopqrstuvwxyz",
		"𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"
	],
	MINIMALISTE: [
		"abcdefghijklmnopqrstuvwxyz",
		"𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇"
	]
};

const STYLE_DETAILS = [
	{
		title: "𓆩 🖤 𓆪 𝗗𝗔𝗥𝗞 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𓆩 🦇 𓆪",
		top: "╔═══『 🖤 』════════════╗",
		bottom: "╚════════════『 🦇 』═══╝",
		emojis: "🖤 🦇 ⛓️ 🌑 🥀",
		side: "𓆩"
	},
	{
		title: "🚨 𝐔𝐑𝐆𝐄𝐍𝐓 𝐀𝐋𝐄𝐑𝐓 🚨",
		top: "╔══════ ⚠️🚨⚠️ ══════╗",
		bottom: "╚══════ ⚠️🚨⚠️ ══════╝",
		emojis: "🚨 ⚠️ 🔴 ❗ 📛",
		side: "⚠️"
	},
	{
		title: "𓆩 🩸 𓆪 𝕭𝕷𝕺𝕺𝕯 𝕸𝕰𝕾𝕾𝕬𝕲𝕰",
		top: "╔════『 🩸⛓️ 』════╗",
		bottom: "╚════『 🩸⛓️ 』════╝",
		emojis: "🩸 🥀 ⛓️ 🔥 🗡️",
		side: "🩸"
	},
	{
		title: "『 💠 𝙲𝚈𝙱𝙴𝚁 𝙽𝙴𝚃𝚆𝙾𝚁𝙺 💠 』",
		top: "╔═══【 ⚡ SYSTEM ⚡ 】═══╗",
		bottom: "╚═══【 💠 END SYSTEM 💠 】╝",
		emojis: "💠 ⚡ 🤖 🔷 💻",
		side: "◆"
	},
	{
		title: "♛ 𝓡𝓞𝓨𝓐𝓛 𝓐𝓝𝓝𝓞𝓤𝓝𝓒𝓔𝓜𝓔𝓝𝓣 ♛",
		top: "╔══════ 👑 ♛ 👑 ══════╗",
		bottom: "╚══════ 👑 ♛ 👑 ══════╝",
		emojis: "👑 💎 🏰 ✨ ⚜️",
		side: "♛"
	},
	{
		title: "˚₊‧꒰ა 𝘚𝘖𝘍𝘛 𝘔𝘌𝘚𝘚𝘈𝘎𝘌 ໒꒱ ‧₊˚",
		top: "╔═══ 🌙 ✨ 🌸 ═══╗",
		bottom: "╚═══ 🌸 ✨ 🌙 ═══╝",
		emojis: "🌙 ✨ 🌸 🕊️ 💗",
		side: "✧"
	},
	{
		title: "✦ 𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧 ✦",
		top: "┏━━━━━━━━━━━━━━━━━━┓",
		bottom: "┗━━━━━━━━━━━━━━━━━━┛",
		emojis: "✦ • ◈ ◆ ✧",
		side: "•"
	}
];

const CONCURRENCY = 5;
const SEND_TIMEOUT = 10000;
const BATCH_DELAY = 400;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function applyFont(text, style) {
	const alphabet = ALPHABETS[STYLE_NAMES[style]];

	if (!alphabet)
		return text;

	const [normal, fancy] = alphabet;
	const map = {};

	for (let i = 0; i < normal.length; i++)
		map[normal[i]] = fancy[i];

	return Array.from(text).map(char => {
		const lower = char.toLowerCase();
		if (!map[lower])
			return char;

		const converted = map[lower];

		return char === lower
			? converted
			: converted.toUpperCase();
	}).join("");
}

function formatAnnouncement(category, style, content) {
	const details = STYLE_DETAILS[style];
	const formattedContent = content
		.split("\n")
		.map(line => applyFont(line, style))
		.join("\n");

	return [
		details.top,
		"",
		details.title,
		"",
		`╭─────── ${details.side} ───────╮`,
		`📌 ${category}`,
		`╰────────────────────╯`,
		"",
		"✧･ﾟ: *✧･ﾟ:*",
		"",
		formattedContent,
		"",
		"* :･ﾟ✧*:･ﾟ✧",
		"",
		`${details.emojis}`,
		"",
		details.bottom
	].join("\n");
}

// Enregistrement sécurisé du menu de réponse
async function createReply(message, state) {
	const sent = await message.reply(state.text);

	if (!sent || !sent.messageID)
		throw new Error("Impossible de créer le menu de réponse.");

	global.GoatBot.onReply.set(sent.messageID, {
		commandName: "annonce",
		...state
	});
}

// Envoi avec délai maximal pour éviter les blocages
function sendWithTimeout(api, body, threadID) {
	return new Promise((resolve, reject) => {
		let finished = false;

		const timer = setTimeout(() => {
			if (finished) return;
			finished = true;
			reject(new Error("Délai d'envoi dépassé."));
		}, SEND_TIMEOUT);

		function finish(err, info) {
			if (finished) return;
			finished = true;
			clearTimeout(timer);

			if (err)
				return reject(err);

			resolve(info);
		}

		try {
			const result = api.sendMessage(
				{ body },
				threadID,
				finish
			);

			// Compatibilité avec les API qui renvoient une Promise.
			if (result && typeof result.then === "function")
				result.then(info => finish(null, info)).catch(finish);
		}
		catch (err) {
			finish(err);
		}
	});
}

module.exports = {
	config: {
		name: "annonce",
		version: "2.0.0",
		author: "Kenny",
		countDown: 10,
		role: 4,
		description: "Diffuser une annonce décorée dans tous les groupes",
		category: "owner",
		guide: {
			fr: "~annonce : ouvrir le menu de diffusion"
		}
	},

	onStart: async function ({ event, message, role }) {
		if (role < 4)
			return message.reply(
				"⛔ Cette commande est réservée aux administrateurs du bot."
			);

		const ownerID = event.senderID || event.author;

		const text =
			"╔════════════════════╗\n" +
			"       🖤 𝗖𝗘𝗡𝗧𝗥𝗘 𝗗'𝗔𝗡𝗡𝗢𝗡𝗖𝗘𝗦 🖤\n" +
			"╚════════════════════╝\n\n" +
			"📂 **CHOISIS UNE CATÉGORIE**\n\n" +
			CATEGORIES.map((item, i) => `${i + 1}️⃣ ${item}`).join("\n") +
			"\n\n━━━━━━━━━━━━━━━━━━\n" +
			"✉️ Réponds avec le numéro de ton choix.";

		await createReply(message, {
			ownerID,
			step: "category",
			text
		});
	},

	onReply: async function ({ api, event, message, Reply, role }) {
		if (role < 4)
			return message.reply(
				"⛔ Tu n'as plus l'autorisation d'utiliser cette commande."
			);

		const senderID = event.senderID || event.author;

		if (senderID !== Reply.ownerID)
			return message.reply(
				"⛔ Ce menu appartient à un autre administrateur."
			);

		const answer = (event.body || "").trim();
		const choice = Number(answer);
		const replyID = event.messageReply?.messageID;

		if (replyID)
			global.GoatBot.onReply.delete(replyID);

		const next = async (state, text) => {
			await createReply(message, {
				ownerID: Reply.ownerID,
				...state,
				text
			});
		};

		// ÉTAPE 1 : CATÉGORIE
		if (Reply.step === "category") {
			if (!Number.isInteger(choice) || choice < 1 || choice > CATEGORIES.length) {
				return next(
					{ step: "category" },
					"❌ Numéro invalide.\n\n" +
					CATEGORIES.map((item, i) => `${i + 1}️⃣ ${item}`).join("\n") +
					"\n\nChoisis un numéro entre 1 et 5."
				);
			}

			return next(
				{
					step: "style",
					category: choice - 1
				},
				"╔══════ 🎨 ══════╗\n" +
				"       𝗖𝗛𝗢𝗜𝗫 𝗗𝗨 𝗦𝗧𝗬𝗟𝗘\n" +
				"╚════════════════╝\n\n" +
				STYLES.map((item, i) => `${i + 1}️⃣ ${item}`).join("\n") +
				"\n\n✧ Réponds avec un numéro entre 1 et 7."
			);
		}

		// ÉTAPE 2 : STYLE
		if (Reply.step === "style") {
			if (!Number.isInteger(choice) || choice < 1 || choice > STYLES.length) {
				return next(
					{
						step: "style",
						category: Reply.category
					},
					"❌ Style invalide.\n\n" +
					STYLES.map((item, i) => `${i + 1}️⃣ ${item}`).join("\n") +
					"\n\nChoisis un numéro entre 1 et 7."
				);
			}

			return next(
				{
					step: "content",
					category: Reply.category,
					style: choice - 1
				},
				"╔══════ ✍️ ══════╗\n" +
				"       𝗥𝗘𝗗𝗔𝗖𝗧𝗜𝗢𝗡\n" +
				"╚════════════════╝\n\n" +
				`📂 Catégorie : ${CATEGORIES[Reply.category]}\n` +
				`🎨 Style : ${STYLES[choice - 1]}\n\n` +
				"Envoie maintenant le texte de ton annonce.\n\n" +
				"⚠️ Ton texte sera conservé et décoré automatiquement."
			);
		}

		// ÉTAPE 3 : CONTENU
		if (Reply.step === "content") {
			if (!answer || answer.length < 2) {
				return next(
					{
						step: "content",
						category: Reply.category,
						style: Reply.style
					},
					"❌ Ton annonce est trop courte.\nEnvoie un texte valide."
				);
			}

			if (answer.length > 5000) {
				return next(
					{
						step: "content",
						category: Reply.category,
						style: Reply.style
					},
					"❌ Maximum autorisé : 5 000 caractères.\nRaccourcis ton annonce."
				);
			}

			const preview = formatAnnouncement(
				CATEGORIES[Reply.category],
				Reply.style,
				answer
			);

			return next(
				{
					step: "confirm",
					category: Reply.category,
					style: Reply.style,
					content: answer
				},
				preview +
				"\n\n╔══════ 👁️ ══════╗\n" +
				"       𝗔𝗣𝗘𝗥𝗖̧𝗨 𝗙𝗜𝗡𝗔𝗟\n" +
				"╚════════════════╝\n\n" +
				"1️⃣ ENVOYER DANS TOUS LES GROUPES\n" +
				"2️⃣ ANNULER LA DIFFUSION\n\n" +
				"Réponds avec 1 ou 2."
			);
		}

		// ÉTAPE 4 : CONFIRMATION
		if (Reply.step === "confirm") {
			if (choice === 2) {
				return message.reply(
					"╔══════ ❌ ══════╗\n" +
					"     𝗗𝗜𝗙𝗙𝗨𝗦𝗜𝗢𝗡 𝗔𝗡𝗡𝗨𝗟𝗘́𝗘\n" +
					"╚════════════════╝\n\n" +
					"🖤 Aucun groupe n'a reçu cette annonce."
				);
			}

			if (choice !== 1) {
				return next(
					{
						step: "confirm",
						category: Reply.category,
						style: Reply.style,
						content: Reply.content
					},
					"⚠️ Réponse invalide.\n\n1️⃣ Envoyer\n2️⃣ Annuler"
				);
			}

			const groups = (global.db.allThreadData || []).filter(thread =>
				thread &&
				thread.isGroup === true &&
				thread.threadID &&
				!isNaN(thread.threadID)
			);

			const uniqueGroups = [
				...new Map(
					groups.map(group => [String(group.threadID), group])
				).values()
			];

			if (uniqueGroups.length === 0) {
				return message.reply(
					"⚠️ Aucun groupe disponible pour la diffusion."
				);
			}

			const announcement = formatAnnouncement(
				CATEGORIES[Reply.category],
				Reply.style,
				Reply.content
			);

			await message.reply(
				"╔══════ 🚀 ══════╗\n" +
				"     𝗗𝗜𝗙𝗙𝗨𝗦𝗜𝗢𝗡 𝗟𝗔𝗡𝗖𝗘́𝗘\n" +
				"╚════════════════╝\n\n" +
				`📦 Groupes ciblés : ${uniqueGroups.length}\n` +
				`⚡ Envois simultanés : ${CONCURRENCY}\n\n` +
				"Le rapport sera envoyé à la fin."
			);

			let success = 0;
			let failed = 0;
			let completed = 0;

			// Traitement par lots pour éviter d'attendre chaque groupe
			// individuellement et limiter la pression sur Messenger.
			for (
				let i = 0;
				i < uniqueGroups.length;
				i += CONCURRENCY
			) {
				const batch = uniqueGroups.slice(i, i + CONCURRENCY);

				const results = await Promise.all(
					batch.map(async group => {
						try {
							await sendWithTimeout(
								api,
								announcement,
								group.threadID
							);
							return true;
						}
						catch (err) {
							console.error(
								`[ANNONCE] Échec ${group.threadID}:`,
								err.message || err
							);
							return false;
						}
					})
				);

				for (const result of results) {
					if (result)
						success++;
					else
						failed++;
				}

				completed += batch.length;

				// Petit point de progression après chaque lot.
				if (completed < uniqueGroups.length) {
					await sleep(BATCH_DELAY);
				}

				console.log(
					`[ANNONCE] Progression : ${completed}/${uniqueGroups.length} | Réussis : ${success} | Échecs : ${failed}`
				);
			}

			return message.reply(
				"╔════════════════════╗\n" +
				"       📊 𝗥𝗔𝗣𝗣𝗢𝗥𝗧 𝗙𝗜𝗡𝗔𝗟\n" +
				"╚════════════════════╝\n\n" +
				`📂 Catégorie : ${CATEGORIES[Reply.category]}\n` +
				`🎨 Style : ${STYLES[Reply.style]}\n\n` +
				"━━━━━━━━━━━━━━━━━━\n" +
				`📦 Groupes ciblés : ${uniqueGroups.length}\n` +
				`✅ Envois réussis : ${success}\n` +
				`❌ Envois échoués : ${failed}\n` +
				`📊 Total traité : ${completed}\n` +
				"━━━━━━━━━━━━━━━━━━\n\n" +
				(
					failed === 0
						? "🖤 Toutes les annonces ont été envoyées."
						: "⚠️ Diffusion terminée. Certains envois ont échoué."
				)
			);
		}
	}
};
      
