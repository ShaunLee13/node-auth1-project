const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcrypt.hashSync(password, rounds);
    Users.add({ username, password: hash })
        .then(user => {
            res.status(201).json({ data: user });
        })
        .catch(err => res.json({ error: err.message }));
});

router.post('/login', (req, res) => {
    const { username, password} = req.body

    Users.findBy({username})
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)){
                req.session.loggedIn = true
                res.status(200).json(
                    {
                        hello: user.username,
                        session: req.session
                    }
                    )
            } else {
                res.status(401)
            }
        })
        .catch(error => {
            res.status(500).json({error:error.message})
        })
})

router.get('/logout', (req,res) => {
    if(req.session.loggedIn){
        req.session.destroy()
    } else {
        res.status(200).json({message:'User not logged in'})
    }
})
module.exports = router;