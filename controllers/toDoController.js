const {User,Todo} = require('../models')
// const {compare} = require('../helpers/bcrypt')
// const generateToken = require('../helpers/jwt')
const Axios = require('axios')

class ToDoController{

    static list(req,res){


        Todo
            .findAll({order : [['id','ASC']], where : {UserId : req.LoginId}})
            .then(data => {
                res.status(200).json({todos : data})
            })
            .catch(err => {
                res.status(500).json({error : err})
            })
    }

    static createToDo(req,res){
        
        let {title , description, due_date} = req.body
        let UserId = req.LoginId

        Todo    
            .create({title,description, due_date, UserId})
            .then(data => res.status(201).json({todo : data}))
            .catch(err => {
               
                    res.status(400).json({err : err.message})

            })
    }

    static updateToDo(req,res){

        let { title, description , due_date} = req.body

        Todo
            .update({
                'title' : title,
                'description' : description,
                'due_date' : due_date
            }, {where : {id : req.params.id}})
            .then(data => {
                return Todo.findByPk(req.params.id)
            })
            .then(data => {
                if (data == null){
                    res.status(404).json({err : "id not found"})
                }else {
                    res.status(200).json({todo : data})
                }    
            })
            .catch(err => {
                res.status(400).json({err : err.message})
            })
    }

    static getId(req,res){

        Todo
            .findByPk(req.params.id)
            .then(data => {
                if (data == null){
                    res.status(404).json({error : "id not found"})
                }else {
                    res.status(200).json({todo : data})
                }

            })
            .catch(err => {
                res.status(400).json({error : err.message})
            })
    }

    static deleteToDo(req,res){

        const p1 = Todo
                    .findByPk(req.params.id)
                    .then(data1 => {
                                let results = Object.assign(data1)
                                return results
                             })
                    .catch(err => res.status(404).json({error : err.message}))

        const p2 = Todo
                    .destroy({where : {id : req.params.id},returning : true})
                    .then(data => {return data})
                    .catch(err => res.status(404).json({error : err}))


        Promise.all([p2,p1]).then(data => {
                                    res.status(200).json({todo : data[1]})
                             })
                            .catch(err => res.status(404).json({error : err}))


    }

}

module.exports = ToDoController