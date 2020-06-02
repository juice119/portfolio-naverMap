const path = require('path');
//대문자는 module
const Sequelize = require('sequelize'); 

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.js'));
console.log(config);
const db = {};

//소문자는 config파일을 이용하여 연결후 기능을 하는 실질적인 
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, config.development);  

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//model에 있는 모델링한 table을 db에 추가시켜 다른 곳에서도 사용할수 있게 한다.
db.Path = require('./path')(sequelize, Sequelize);
db.DetailPath = require('./detailpath')(sequelize, Sequelize);

db.Path.hasOne(db.DetailPath);
db.DetailPath.belongsTo(db.Path);

module.exports = db;