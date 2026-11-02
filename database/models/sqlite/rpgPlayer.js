"use strict";

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("rpg_players", {
        userID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING,
            defaultValue: "Sans-nom"
        },

        class: {
            type: DataTypes.STRING,
            defaultValue: null
        },

        specialization: {
            type: DataTypes.STRING,
            defaultValue: null
        },

        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },

        xp: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },

        prestige: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        stats: {
            type: DataTypes.JSON,
            defaultValue: {
                vit: 5,
                str: 5,
                int: 5,
                dex: 5,
                agi: 5,
                end: 5
            }
        },

        statPoints: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        hp: {
            type: DataTypes.INTEGER,
            defaultValue: 200
        },

        maxHp: {
            type: DataTypes.INTEGER,
            defaultValue: 200
        },

        mp: {
            type: DataTypes.INTEGER,
            defaultValue: 50
        },

        maxMp: {
            type: DataTypes.INTEGER,
            defaultValue: 50
        },

        gold: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },

        darkCrystals: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        ascensionSeals: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        inventory: {
            type: DataTypes.JSON,
            defaultValue: []
        },

        equipment: {
            type: DataTypes.JSON,
            defaultValue: {
                weapon: null,
                helmet: null,
                armor: null,
                gloves: null,
                boots: null,
                accessory: null
            }
        },

        quests: {
            type: DataTypes.JSON,
            defaultValue: {
                active: [],
                completed: []
            }
        },

        status: {
            type: DataTypes.JSON,
            defaultValue: {
                injured: false,
                deathMarkUntil: 0,
                effects: []
            }
        },

        victories: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        defeats: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        lastDaily: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },

        lastCombat: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        }
    }, {
        timestamps: true,
        indexes: [
            { fields: ["level"] },
            { fields: ["prestige"] }
        ]
    });
};
          
