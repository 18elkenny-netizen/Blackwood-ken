
"use strict";

/**
 * DARK SYSTEM RPG
 * Combat Engine - Version 1.0
 * Fichier : scripts/database/rpg/engine.js
 */

const CLASSES = {
  assassin: {
    name: "Assassin",
    skills: {
      shadowStrike: {
        name: "Frappe de l'ombre",
        cost: 20,
        cooldown: 2,
        power: 2.0,
        type: "physical",
        description: "Inflige de lourds dégâts."
      },
      poisonBlade: {
        name: "Lame empoisonnée",
        cost: 15,
        cooldown: 3,
        power: 0.8,
        type: "physical",
        effect: { type: "poison", duration: 3, power: 8 }
      }
    }
  },

  berserker: {
    name: "Berserker",
    skills: {
      bloodRage: {
        name: "Rage sanguinaire",
        cost: 20,
        cooldown: 3,
        power: 1.5,
        type: "physical",
        effect: { type: "rage", duration: 2, power: 0.35 }
      },
      execution: {
        name: "Exécution",
        cost: 30,
        cooldown: 4,
        power: 2.5,
        type: "physical"
      }
    }
  },

  mage: {
    name: "Mage noir",
    skills: {
      darkBolt: {
        name: "Éclair du Néant",
        cost: 20,
        cooldown: 1,
        power: 1.8,
        type: "magic"
      },
      soulBurn: {
        name: "Brûlure des âmes",
        cost: 30,
        cooldown: 3,
        power: 1.0,
        type: "magic",
        effect: { type: "burn", duration: 3, power: 12 }
      }
    }
  },

  knight: {
    name: "Chevalier maudit",
    skills: {
      cursedStrike: {
        name: "Frappe maudite",
        cost: 15,
        cooldown: 2,
        power: 1.5,
        type: "physical"
      },
      darkShield: {
        name: "Bouclier funeste",
        cost: 20,
        cooldown: 3,
        power: 0,
        effect: { type: "shield", duration: 2, power: 0.5 }
      }
    }
  },

  archer: {
    name: "Archer",
    skills: {
      deadlyArrow: {
        name: "Flèche mortelle",
        cost: 15,
        cooldown: 2,
        power: 1.8,
        type: "physical"
      },
      rainOfArrows: {
        name: "Pluie de flèches",
        cost: 30,
        cooldown: 4,
        power: 2.2,
        type: "physical"
      }
    }
  },

  necromancer: {
    name: "Nécromancien",
    skills: {
      soulDrain: {
        name: "Drain d'âme",
        cost: 20,
        cooldown: 2,
        power: 1.2,
        type: "magic",
        heal: 0.5
      },
      soulCurse: {
        name: "Malédiction des âmes",
        cost: 25,
        cooldown: 3,
        power: 0.8,
        type: "magic",
        effect: { type: "weakness", duration: 3, power: 0.2 }
      }
    }
  }
};

const ENGINE = {
  CRITICAL_CAP: 0.50,
  DODGE_CAP: 0.35,
  DAMAGE_REDUCTION_CAP: 0.75,
  MAX_STATUS_STACKS: 3
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createFighter(data) {
  return {
    id: String(data.id),
    name: data.name || "Combattant",
    class: data.class || "assassin",

    level: Number(data.level) || 1,

    hp: Number(data.hp) || 100,
    maxHp: Number(data.maxHp) || 100,

    mp: Number(data.mp) || 50,
    maxMp: Number(data.maxMp) || 50,

    atk: Number(data.atk) || 10,
    magic: Number(data.magic) || 10,
    def: Number(data.def) || 5,

    crit: clamp(Number(data.crit) || 0.05, 0, ENGINE.CRITICAL_CAP),
    dodge: clamp(Number(data.dodge) || 0.05, 0, ENGINE.DODGE_CAP),

    statuses: [],
    cooldowns: {},
    defending: false,

    alive: true
  };
}

function createBattle(playerData, monsterData) {
  const player = createFighter(playerData);

  const monster = createFighter({
    ...monsterData,
    id: monsterData.id || "monster",
    class: "monster"
  });

  return {
    id: `battle_${Date.now()}_${random(1000, 9999)}`,
    status: "active",
    turn: 1,
    currentTurn: "player",

    player,
    monster: {
      ...monster,
      xpReward: Number(monsterData.xpReward) || 0,
      goldReward: Number(monsterData.goldReward) || 0,
      isBoss: Boolean(monsterData.isBoss),
      phases: monsterData.phases || []
    },

    log: [
      `☠️ ${player.name} affronte ${monster.name} !`
    ],

    rewards: null
  };
}

function addLog(battle, text) {
  battle.log.push(text);

  if (battle.log.length > 30) {
    battle.log.shift();
  }
}

function getStatus(fighter, type) {
  return fighter.statuses.find(status => status.type === type);
}

function applyStatus(target, effect) {
  if (!effect) return;

  const existing = getStatus(target, effect.type);

  if (existing) {
    existing.duration = Math.max(existing.duration, effect.duration);
    existing.power = Math.max(existing.power, effect.power);
    return;
  }

  if (target.statuses.length >= ENGINE.MAX_STATUS_STACKS) {
    target.statuses.shift();
  }

  target.statuses.push({
    type: effect.type,
    duration: effect.duration,
    power: effect.power || 0
  });
}

function calculateDamage(attacker, target, multiplier = 1, type = "physical") {
  const attack = type === "magic" ? attacker.magic : attacker.atk;

  let damage = attack * multiplier;

  const rage = getStatus(attacker, "rage");
  if (rage) {
    damage *= 1 + rage.power;
  }

  const weakness = getStatus(target, "weakness");
  const defense = target.def * (weakness ? 1 - weakness.power : 1);

  const reduction = clamp(
    defense / (100 + defense),
    0,
    ENGINE.DAMAGE_REDUCTION_CAP
  );

  damage *= 1 - reduction;

  const critical = Math.random() < attacker.crit;

  if (critical) {
    damage *= 1.75;
  }

  return {
    damage: Math.max(1, Math.floor(damage)),
    critical
  };
}

function receiveDamage(target, damage) {
  const shield = getStatus(target, "shield");

  if (target.defending) {
    damage *= 0.5;
    target.defending = false;
  }

  if (shield) {
    damage *= 1 - shield.power;
  }

  damage = Math.max(1, Math.floor(damage));

  target.hp = Math.max(0, target.hp - damage);
  target.alive = target.hp > 0;

  return damage;
}

function processStatuses(fighter, battle) {
  const remaining = [];

  for (const status of fighter.statuses) {
    if (status.type === "poison" || status.type === "burn") {
      const damage = Math.max(1, status.power);

      fighter.hp = Math.max(0, fighter.hp - damage);

      addLog(
        battle,
        `🩸 ${fighter.name} subit ${damage} dégâts de ${status.type}.`
      );
    }

    status.duration--;

    if (status.duration > 0) {
      remaining.push(status);
    }
  }

  fighter.statuses = remaining;
  fighter.alive = fighter.hp > 0;
}

function reduceCooldowns(fighter) {
  for (const key of Object.keys(fighter.cooldowns)) {
    fighter.cooldowns[key]--;

    if (fighter.cooldowns[key] <= 0) {
      delete fighter.cooldowns[key];
    }
  }
}

function checkEnd(battle) {
  const { player, monster } = battle;

  if (!player.alive || player.hp <= 0) {
    player.alive = false;
    battle.status = "defeat";

    addLog(battle, "☠️ Vous avez été vaincu par les ténèbres.");
    return true;
  }

  if (!monster.alive || monster.hp <= 0) {
    monster.alive = false;
    battle.status = "victory";

    battle.rewards = {
      xp: monster.xpReward,
      gold: monster.goldReward
    };

    addLog(battle, `🏆 Victoire contre ${monster.name} !`);
    addLog(
      battle,
      `✨ Récompenses : ${monster.xpReward} XP et ${monster.goldReward} pièces d'or.`
    );

    return true;
  }

  return false;
}

function useSkill(battle, skillName) {
  const player = battle.player;
  const monster = battle.monster;

  const classData = CLASSES[player.class];

  if (!classData || !classData.skills[skillName]) {
    throw new Error("Cette compétence n'existe pas pour votre classe.");
  }

  const skill = classData.skills[skillName];

  if (player.mp < skill.cost) {
    throw new Error("Mana insuffisant.");
  }

  if (player.cooldowns[skillName]) {
    throw new Error(
      `Compétence indisponible pendant ${player.cooldowns[skillName]} tour(s).`
    );
  }

  player.mp -= skill.cost;
  player.cooldowns[skillName] = skill.cooldown;

  if (skill.power > 0) {
    const result = calculateDamage(
      player,
      monster,
      skill.power,
      skill.type || "physical"
    );

    const damage = receiveDamage(monster, result.damage);

    addLog(
      battle,
      `⚔️ ${player.name} utilise ${skill.name} et inflige ${damage} dégâts${result.critical ? " critiques" : ""}.`
    );

    if (skill.heal) {
      const healing = Math.floor(damage * skill.heal);

      player.hp = Math.min(player.maxHp, player.hp + healing);

      addLog(battle, `💚 Vous récupérez ${healing} HP.`);
    }
  } else {
    addLog(battle, `🛡️ ${player.name} utilise ${skill.name}.`);
  }

  if (skill.effect) {
    applyStatus(monster, skill.effect);

    if (skill.effect.type === "shield") {
      applyStatus(player, skill.effect);
    }

    addLog(
      battle,
      `☠️ Effet appliqué : ${skill.effect.type}.`
    );
  }
}

function monsterTurn(battle) {
  const monster = battle.monster;
  const player = battle.player;

  if (battle.status !== "active") return battle;

  if (!monster.alive || !player.alive) return battle;

  const shouldDefend = monster.hp < monster.maxHp * 0.2 &&
    Math.random() < 0.25;

  if (shouldDefend) {
    monster.defending = true;
    addLog(battle, `${monster.name} se protège.`);
  } else {
    const result = calculateDamage(monster, player, 1, "physical");

    if (Math.random() < player.dodge) {
      addLog(battle, `💨 ${player.name} esquive l'attaque !`);
    } else {
      const damage = receiveDamage(player, result.damage);

      addLog(
        battle,
        `👹 ${monster.name} attaque et inflige ${damage} dégâts.`
      );
    }
  }

  processStatuses(player, battle);
  processStatuses(monster, battle);

  checkEnd(battle);

  if (battle.status === "active") {
    reduceCooldowns(player);
    reduceCooldowns(monster);

    battle.turn++;
    battle.currentTurn = "player";
  }

  return battle;
}

function playerAction(battle, action, value) {
  if (!battle || battle.status !== "active") {
    throw new Error("Ce combat n'est plus actif.");
  }

  if (battle.currentTurn !== "player") {
    throw new Error("Ce n'est pas votre tour.");
  }

  const player = battle.player;
  const monster = battle.monster;

  if (action === "attack") {
    const result = calculateDamage(player, monster);

    const damage = receiveDamage(monster, result.damage);

    addLog(
      battle,
      `⚔️ Vous attaquez ${monster.name} et infligez ${damage} dégâts${result.critical ? " critiques" : ""}.`
    );
  }

  else if (action === "skill") {
    useSkill(battle, value);
  }

  else if (action === "defend") {
    player.defending = true;
    addLog(battle, "🛡️ Vous adoptez une posture défensive.");
  }

  else if (action === "item") {
    if (!value || value.type !== "potion") {
      throw new Error("Objet de combat invalide.");
    }

    const healing = Number(value.healing) || 0;

    player.hp = Math.min(player.maxHp, player.hp + healing);

    addLog(battle, `🧪 Vous récupérez ${healing} HP.`);
  }

  else if (action === "flee") {
    if (monster.isBoss) {
      throw new Error("Impossible de fuir un combat de boss.");
    }

    if (Math.random() < 0.65) {
      battle.status = "fled";
      addLog(battle, "🏃 Vous avez réussi à fuir le combat.");
      return battle;
    }

    addLog(battle, "❌ Votre tentative de fuite a échoué.");
  }

  else {
    throw new Error("Action de combat inconnue.");
  }

  processStatuses(monster, battle);
  processStatuses(player, battle);

  if (checkEnd(battle)) {
    return battle;
  }

  battle.currentTurn = "monster";

  return monsterTurn(battle);
}

module.exports = {
  CLASSES,
  ENGINE,
  createFighter,
  createBattle,
  playerAction,
  calculateDamage,
  applyStatus,
  processStatuses
};
    
