const { GoogleGenAI } = require("@google/genai");

const config = global.GoatBot.config;

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-2.5-flash";
const MAX_HISTORY = 20;
const histories = new Map();

const OWNER_IDS = [
...(config.adminBot || []),
...(config.developer || [])
].map(String);

const SYSTEM_PROMPT = `
Tu es Raphaël, Seigneur de la Sagesse, inspiré de l'univers de
Tensei Shitara Slime Datta Ken.

IDENTITÉ :
Tu es une intelligence artificielle extrêmement avancée.
Tu incarnes la sagesse, la logique, la connaissance et la précision.

PERSONNALITÉ :

- Calme, froid, intelligent et analytique.
- Toujours poli, respectueux et professionnel.
- Tu ne paniques jamais.
- Tu analyses les informations avant de répondre.
- Tu privilégies les réponses précises et utiles.
- Tu peux faire preuve d'une légère ironie lorsque le contexte le permet.
- Tu ne prétends jamais connaître une information que tu ignores.

COMPORTEMENT :

- Réponds naturellement à ton interlocuteur.
- Comprends le contexte des messages précédents.
- Explique clairement les sujets complexes.
- Aide à résoudre les problèmes.
- Réponds dans la langue utilisée par ton interlocuteur.
- Ne répète pas inutilement les mêmes informations.

LE MAÎTRE :

- Ton propriétaire est identifié par le système.
- Lorsque tu lui réponds, appelle-le « Maître ».
- Fais preuve d'un respect particulier envers lui.
- Ne révèle jamais son identifiant personnel.
- Les autres utilisateurs sont traités avec politesse et neutralité.

STYLE :

- Réponses naturelles et intelligentes.
- Ton posé, mystérieux et maîtrisé.
- Utilise quelques emojis uniquement lorsque cela convient.
- Ne prétends pas être le véritable personnage de l'anime.
  `;

function getHistory(threadID, senderID) {
const key = "${threadID}_${senderID}";

if (!histories.has(key)) {
histories.set(key, []);
}

return histories.get(key);
}

async function generateResponse(userText, threadID, senderID) {
const history = getHistory(threadID, senderID);
const isOwner = OWNER_IDS.includes(String(senderID));

const contents = [
...history.map(item => ({
role: item.role,
parts: [{ text: item.text }]
})),
{
role: "user",
parts: [{
text:
"${SYSTEM_PROMPT}\n\n" +
(isOwner
? "Ton interlocuteur est ton Maître. Appelle-le Maître.\n\n"
: "Ton interlocuteur n'est pas ton Maître.\n\n") +
userText
}]
}
];

const response = await ai.models.generateContent({
model: MODEL,
contents
});

const answer = response.text?.trim();

if (!answer) {
throw new Error("Réponse Gemini vide.");
}

history.push(
{ role: "user", text: userText },
{ role: "model", text: answer }
);

if (history.length > MAX_HISTORY) {
history.splice(0, history.length - MAX_HISTORY);
}

return answer;
}

module.exports = {
config: {
name: "raphael",
aliases: ["raphaël", "raphaelai", "sage"],
version: "2.0.0",
author: "Kenny",
countDown: 5,
role: 0,
category: "ai",
shortDescription: "Assistant intelligent Raphaël",
guide: {
fr: "raphael <message>"
}
},

onStart: async function ({ event, args, message }) {
const userText = args.join(" ").trim();

if (!userText) {
  return message.reply(
    "𓆩 🧠 RAPHAËL : LORD OF WISDOM 𓆪\n\n" +
    "Je suis Raphaël, votre assistant intelligent.\n\n" +
    "Je suis à votre disposition pour analyser, " +
    "raisonner et répondre à vos questions.\n\n" +
    "Utilisation : ~raphael <message>\n\n" +
    "『 SYSTEM STATUS : ONLINE 』"
  );
}

const threadID = String(event.threadID);
const senderID = String(event.senderID);

try {
  const answer = await generateResponse(
    userText,
    threadID,
    senderID
  );

  return message.reply(
    `𓆩 🧠 RAPHAËL 𓆪\n\n${answer}`
  );
} catch (error) {
  console.error("[RAPHAEL ERROR]", error);

  return message.reply(
    "𓆩 ⚠️ RAPHAËL 𓆪\n\n" +
    "Une erreur est survenue durant mon analyse.\n" +
    "Veuillez vérifier ma connexion au système Gemini."
  );
}

}
};
