const { Answer } = require('../models');

module.exports = {
  
    store: async (answer) => {
        try {
            const result = await Answer.create(answer);
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status:422, msg:error.message};
        }
    },

    update: async (answer) => {
        try {
            const answerExist = await Answer.findByPk(answer.id);
            if (!answerExist) {
                return { error: true, status:422, msg:'A resposta informada não foi encontrada'};    
            }
            const result = await Answer.update(answer, { where: { id: answer.id } });
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status:422, msg:error.message};
        }
    },

    destroy: async (id) => {
        try {
            const answerExist = await Answer.findByPk(id);
            if (!answerExist) {
                return { error: true, status:422, msg:'A resposta informada não foi encontrada'};    
            }
            const result = await answerExist.destroy();
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status:422, msg:error.message};
        }
    },

    show: async (id) => {
        try {
            const result = await Answer.findByPk(id);
            if (!result) {
                return { error: true, status:422, msg:'A resposta informada não foi encontrada'};    
            }
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status:422, msg:error.message};
        }
    },

    index: async (limit = 7, page = 1) => {
        limit = parseInt(limit);
        page = parseInt(page) - 1;
        try {
            const { count: size, rows: result } = await Answer.findAndCountAll({
                limit,
                offset: page * limit
            });
            return { size, result };
        } catch (error) {
            console.log(error);
            return { error: true, status:422, msg:error.message};
        }
    }
    
};