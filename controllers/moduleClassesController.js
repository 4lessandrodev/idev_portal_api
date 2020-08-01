const { ModuleClass, Class, Module } = require('../models');

const validateData = async moduleClass => {
    if (!moduleClass) {
        return res.status(422).json({ error: true, msg:'Informe um modulo a ser salvo'});
    }   

    const classExists = await Class.findByPk(moduleClass.classId);
    if (!classExists) {
        return res.status(422).json({ error: true, msg:'A aula não existe'});
    }
    const moduleExists = await Module.findByPk(moduleClass.moduleId);

    if (!moduleExists) {
        return res.status(422).json({ error: true, msg:'A modulo não existe'});
    }

    return {classExists, moduleExists};
};

module.exports = {

    store: async (moduleClass) => {
        try {
            const invalid = await validateData(moduleClass);
            if (invalid.classExists && invalid.moduleExists) {
                const result = await ModuleClass.create(moduleClass);
                return res.status(200).json({ result });
            }
        } catch (error) {
            console.log(error);
            return { error: true, msg: error.message, status: 422 };
        }
    },

    destroy: async (id)=>{
        try {
            const moduleClassExist = await ModuleClass.findByPk(id);
            const result = await moduleClassExist.destroy();
            return res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            return { error: true, msg: error.message, status: 422 };  
        }
    }

};