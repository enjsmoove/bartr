const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/engagements', require('./engagements'));
router.use('/messages', require('./messages'));
router.use('/services', require('./services'));
router.use('/reviews', require('./reviews'));
router.use('/schedules', require('./schedules'));

module.exports = router;