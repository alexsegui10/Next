const { Router } = require('express');
const { handleWebhookAsesoria } = require('../controllers/webhook.controller');

const router = Router();

router.post('/asesoria', handleWebhookAsesoria);

module.exports = router;
