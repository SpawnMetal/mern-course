const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  links: [{type: Types.ObjectId, ref: 'Link'}], // type - id, который определён в MongoDB для связки модели пользователя и записи в БД. ref - к какой коллекции привязываемся
})

module.exports = model('User', schema) // Передаём название модели и схему
