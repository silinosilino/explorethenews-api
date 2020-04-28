require('dotenv').config();

const { NODE_ENV, JWT_SECRET, PORT = 3000 } = process.env;

module.exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mestodb';
module.exports.JWT_SECRET = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
module.exports.PORT = PORT;
