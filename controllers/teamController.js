const { Team, User, Challenge,FeedbackStatus } = require('../models');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const connectedUser = { id: 6, admin: true };
const minCoinsToFeedback = { admin:0, user:1};

const validateId = (id) => {
    id = parseInt(id);
    return (isNaN(id));
};


module.exports = {
    store: async (team) => {
        try {

            if (!team) {
                return { error: true, status:422, msg:'Informe um id válido'};
            }
            
            if (validateId(team.challengeId)) {
                return { error: true, status:422, msg:'Informe um id válido'};
            }

            const avaliableChallenge = await Challenge.findByPk(team.challengeId);
            if (!avaliableChallenge) {
                return { error: true, status:422, msg:'Este desafio não está mais disponível'};
            }
            
            const NOW = new Date();
            const currentDate = moment(NOW);
            const expiresAt = moment(avaliableChallenge.expiresAt);

            if (expiresAt < currentDate) {
                return { error: true, status:422, msg:'Este desafio expirou'};
            }

            const result = await Team.create(team);
            return result;
        } catch (error) {
            return error;
        }  
    },
    

    update: async (team) => {
        try {

            if (!team) {
                return { error: true, status:422, msg:'Informe um id válido'};
            }

            if (validateId(team.id)) {
                return { error: true, status:422, msg:'Informe um id válido'};
            }
            
            const teamExist = await Team.findByPk(team.id);
            if (!teamExist) {
                return { error: true, status:422, msg:'O time informado não está disponível'};
            }

            const result = await Team.update(team, { where: { id:team.id } });

            return result;

        } catch (error) {
            return error;
        }  
    },
    

    destroy: async (id) => {
        try {
            if (validateId(id)) {
                return { error: true, status:422, msg:'Informe um id válido'};
            }
            
            const teamExist = await Team.findByPk(id);
            if (!teamExist) {
                return { error: true, status:422, msg:'O time informado não está disponível'};
            }

            const result = await Team.destroy({ where: { id } });

            return result;

        } catch (error) {
            return error;
        }  
    },

    
    show: async (id) => {
        try {
            let coins;
            (connectedUser.admin) ? coins = 0 : coins = 1;

            if (validateId(id)) {
                return { error: true, status:422, msg:'Informe um id válido'};
            }
            
            const result = await Team.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'members',
                        required: true,
                        where:{coins:{[Op.gte]:coins}}
                    },
                    {
                        model: Challenge,
                        as: 'challenge_team',
                        required: true,
                        attributes:['score', 'xp']
                    },
                    {
                        model: FeedbackStatus,
                        as: 'feedback_status',
                        required: true,
                    },
                ]
            });

            return result;

        } catch (error) {
            return error;
        }  
    },
    

    index: async (limit=14, page = 1) => {
        try {
            let coins;
            (connectedUser.admin) ? coins = minCoinsToFeedback.admin : coins = minCoinsToFeedback.user;
            const result = await Team.findAll({
                include: [
                    {
                        model: User,
                        as: 'members',
                        required: true,
                        where:{coins:{[Op.gte]:coins}}
                    },
                    {
                        model: Challenge,
                        as: 'challenge_team',
                        required: true,
                        attributes:['score', 'xp']
                    },
                    {
                        model: FeedbackStatus,
                        as: 'feedback_status',
                        required: true,
                    },
                ]
            });
            
            return result;
        } catch (error) {
            return error;
        }  
    },
};