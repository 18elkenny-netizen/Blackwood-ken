
module.exports = {
  config: {
    name: "updatehelp",
    version: "1.0",
    author: "Shade",
    countDown: 5,
    role: 4,
    description: {
      fr: "Actualise automatiquement le menu des commandes",
      en: "Refresh the command help menu"
    },
    category: "owner",
    guide: "updatehelp"
  },

  onStart: async function ({ message }) {
    const commands = global.GoatBot.commands;

    if (!commands || !(commands instanceof Map)) {
      return message.reply(
        "❌ Impossible de récupérer la liste des commandes."
      );
    }

    const refresh = global.GoatBot.refreshHelpMenu;

    if (typeof refresh !== "function") {
      return message.reply(
        "❌ Le système Help n'est pas initialisé. Redémarre le bot."
      );
    }

    try {
      const data = refresh();

      const categoryList = data.categories
        .map(category => `• ${category}`)
        .join("\n");

      const report = [
        "𓆩 𝐃𝐀𝐑𝐊 𝐒𝐘𝐒𝐓𝐄𝐌 𓆪",
        "⛧ 𝐇𝐄𝐋𝐏 𝐒𝐘𝐍𝐂𝐇𝐑𝐎𝐍𝐈𝐙𝐀𝐓𝐈𝐎𝐍 ⛧",
        "━━━━━━━━━━━━━━━━━━━━",
        "✅ MENU ACTUALISÉ AVEC SUCCÈS",
        "",
        `📦 Commandes chargées : ${data.total}`,
        `📁 Catégories détectées : ${data.categoryCount}`,
        "",
        "𓆩 📂 CATÉGORIES 𓆪",
        categoryList,
        "",
        "━━━━━━━━━━━━━━━━━━━━",
        "☠️ 𝐃𝐀𝐑𝐊 𝐒𝐘𝐒𝐓𝐄𝐌 • 𝐒𝐇𝐀𝐃𝐄 🎀"
      ].join("\n");

      return message.reply(report);
    } catch (error) {
      console.error("[UPDATEHELP]", error);

      return message.reply(
        "❌ Une erreur est survenue pendant l'actualisation du menu."
      );
    }
  }
};
