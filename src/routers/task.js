const express = require ('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//-----------Task---------
//POST API reqest- Task
router.post('/tasks', auth, async (req,res) => {
    const task = new Task ({
        ...req.body , 
        owner: req.user._id
    })

    try{
        await  task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//GET API reqest- Task
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort ={}

    if(req.query.completed){
        match.completed = req.query.completed==='true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)        
    } catch(e) {
        res.status(500).send()
    }
})

//GET API reqest- Task's id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try { 
        const task = await Task.findOne({ _id, owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

//UPDATE API reqest- Task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body) //keys of the update
    const allowedUpdates = ['description', 'completed']
    const isValiadOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValiadOperation){
        return res.status(404).send({error: 'Invalid updates!'})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }
  
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

//DELETE API reqest- Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete({_id:req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router