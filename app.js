const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const app = express() // Будущий сервер

app.use(express.json({extended: true})) // Для передачи body на сервер

app.use('/api/auth', require('./routes/auth.routes')) // Пути будут /api/auth/...
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV == 'production') {
  // Параметр из package.json. Формируем статическую папку
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  app.get('*', (req, res) => {
    //Любой get запрос, отправляем файл в папки. Таким образом фронт и бэкенд будут работать одновременно, node будет за всё отвечать
    res.rendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000 // Получит данные из default.json

async function start() {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()

app.listen(PORT, () => console.log(`App has been started on post ${PORT}...`))
