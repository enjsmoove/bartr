'use strict';

const Sequelize = require('sequelize');
const { User, AuthLookup } = require('../db');
const db = require('../db');
const Service = require('../db/index').Service;
const router = require('express').Router();
const findAuth0User = require('./util').findAuth0User;

router.get('/:auth0_id', (req, res, next) => {
  User.findOne({ where: { auth0_id: req.params.auth0_id }, include: [db.Service, db.ServiceValue] })
    .then(data => {
      console.log('User GET Request Successful');
      res.status(200).json(data);
    })
})

router.get('/', (req, res, next) => {
  User.findAll()
    .then(data => {
      console.log('User GET Request Successful');
      res.status(200).send(data);
    })
    .catch(next)
})

router.post('/', (req, res, next) => {
    req.user['auth0_id'] = req.user['sub'];
    User.upsert(req.user)
    .then(data => {
      console.log('User POST Request Successful')
      res.status(201);
      res.send('user posted successfully');
    })
    .catch(Sequelize.UniqueConstraintError, () => {
      res.status(400).end('User creation failed due to duplicate email address');
    })
})

router.get('/hash/:hash', (req, res, next) => {
  AuthLookup.find({ where: {hash: req.params.hash}})
  .then(data =>{
    res.send(data)
  })
})

router.post('/hash', (req, res, next) => {
  console.log('got some shit')
  // res.send('litty again')
  AuthLookup.sync().then(function() {
    AuthLookup.findOrCreate({
      where: {
        auth0_id: req.body.auth0_id
      },
      defaults: { // set the default properties if it doesn't exist
        auth0_id: req.body.auth0_id,
        hash: req.body.hash,
      }
    }).then(result => {
      var user = result[0], // the instance of the author
        created = result[1]; // boolean stating if it was created or not

      if (created) {
        console.log('User already exists');
      }

      console.log('Created user...');
      res.send(result)
    });
  })
  //  console.log(created)
  //  res.status(201).send(user)
  // AuthLookup.upsert({auth0_id:req.body.auth0_id, hash:req.body.hash})
  // })÷
  // .then(data => {
  // res.send(req.body)
})

router.put('/', (req, res, next) => {
    findAuth0User(req)
    .then(data => {
        data.updateAttributes({
          email: req.body.email,
          name: req.body.name,
          address: req.body.address,
          geo_lat: req.body.geo_lat,
          geo_long: req.body.geo_lng,
          service_id: req.body.service_id,
          auth0_id: req.body.auth0_id
        })
        res.status(202).send(data);
    })
    .catch(next)
})

module.exports = router;


// delete: (req, res) => {
//   User.destroy({
//     where:{
//       email: req.body.email
//     }
//   })
//       .then(() => {
//         res.redirect('/');
//       })
//       .catch(err => {
//         console.log('Error with User DELETE REQ: ', err);
//         res.status(404);
//       })
// }
