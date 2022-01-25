import MovieModel from './model/Movie.js';
import Joi from 'joi'
import UserModel from './User.js';
import {hashPassword} from './helper.js'
import jwt from 'jsonwebtoken'


const setupRoutes = (app) => {

    app.get('/hello', (req, res) => {
       res.send('Hello from Express')
    })
    
    app.get('/movies', async (req, res) => {
        const conditions = {};

        try {
         const token = req.headers.authorization;

         if(!token){
            res.statusCode = 401;
            res.send('You do not have Permisson!!!')
         }

         const decodedToken = jwt.decode(token);

         const user = await UserModel.findById(decodedToken.sub);

         if(!user){
            res.statusCode = 401;
            res.send('You do not have Permisson!!!')
            return
         }
        } catch (error) {
         res.statusCode = 401;
         console.log(error.message);
        }

       if(req.query.genre) {
        conditions.genres = {$in: [req.query.genre]};
       }

       const movies = await MovieModel.find(conditions)
       
       res.send(movies);
    })
    
    app.get('/movies/:year', async (req, res) => {
       const paramsSchema = Joi.object({
          year: Joi.number().required()
       }) 
       const validationResult = await paramsSchema.validate(req.body);

       if(validationResult.error){
          res.statusCode = 400;
          res.send(validationResult.error.details[0].message);

          return
       }
       const conditions = { 
          year: req.params.year
       };
    
       if (req.query.genre) {
          conditions.genres = {$in: [req.query.genre]}
       }
    
       const movies = await MovieModel.find(conditions)

       res.send(movies);
    })
    
    app.get('*', (req, res) => res.send("URL Not Found"));

    app.post('/user/register', async (req,res) => {
      const {name, email, password, birthdate} = req.body;

      const bodySchema = Joi.object({
         name: Joi.string().required(),
         email: Joi.string().email().required(),         
         password: Joi.string().min(6).required(),
         birthdate: Joi.string().required()
      })

         const validationResult = await bodySchema.validate(req.body);

         if(validationResult.error){
            res.statusCode = 400;
            res.send(validationResult.error.details[0].message);
            return
         }

      try {
         const newUser = new UserModel({
            name,
            email,
            password,
            birthdate
         })
   
         await newUser.save();
   
         res.send(newUser);
      } catch (error){
         res.send(error.message);
      }
    })
    
    app.post('/user/login', async (req, res) => {
      const {email, password} = req.body;
       
      const user = await UserModel.findOne({email});

      if(!user){
         res.statusCode = 401;
         res.send('User Not Found!!!')
      } else {
         if(user.password === hashPassword(password)) {
            const token = jwt.sign({sub: user._id}, user.salt, {expiresIn: 30})
            res.send(token)
         } else {
            res.statusCode = 403;
            res.send('password is wrong')
         }
      }
    })

    app.put('/user/:id', async (req, res) => {
      const {id} = req.params;
      const user = await UserModel.findById(id);

      if(!user){
         res.statusCode = 404;
         res.send('User Not Found!!!')
      } else {
         const {birthdate} = req.body;

         if(birthdate){
            user.birthdate = birthdate;
            user.save();
         }
         res.send(user);
      }
    })
}

export default setupRoutes;