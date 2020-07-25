const { AskForHelp } = require('../models');
const conectedUser = {id:1};
module.exports = {
    
    store: async (askForHelp) => {
        try {
            if (!askForHelp) {
                return { error: true, status: 422, msg: 'Informe os dados' };
            }
            askForHelp.userId = conectedUser.id;
            const result = await AskForHelp.create(askForHelp);
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status: 422, msg: error.message };
        }
    },
    
    update: async (askForHelp) => {
        try {
            let askForHelpExist = await AskForHelp.findByPk(askForHelp.id);
            if (!askForHelpExist) {
                return { error: true, status: 422, msg: 'Não foi encontrado dados para o id' };
            }
            askForHelpExist.avaliable = askForHelp.avaliable;
            askForHelpExist.title = askForHelp.title;
            askForHelpExist.description = askForHelp.description;
            const result = await askForHelpExist.save();
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status: 422, msg: error.message };
        }
    },
    
    index: async (limit = 7, page=1, avaliable=1) => {
        try {
            const { rows:result, size:count } = await AskForHelp.findAndCountAll({
                where: { avaliable },
                limit
            });
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status: 422, msg: error.message };
        }
    },
    
    show: async (id) => {
        try {
            const { rows:result, size:count } = await AskForHelp.findByPk(id);
            return result;
        } catch (error) {
            console.log(error);
            return { error: true, status: 422, msg: error.message };
        }
    }
    
};