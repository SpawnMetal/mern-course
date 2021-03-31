// Файл генерации ссылок, которые будем сокращать в приложении

const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/generate', auth, async (req, res) => {
  try {
    const baseURL = config.get('baseURL')
    const {from} = req.body

    const code = shortid.generate()

    const existing = await Link.findOne({from})

    if (existing) return res.json({link: existing}) // Если ссылка уже существует, просто возвращаем её

    const to = baseURL + '/t/' + code

    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    })

    await link.save()

    res.status(201).json({link})
  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({owner: req.user.userId}) // Мы делаем запрос в БД, где ищем все ссылки относящиеся к текущему юзеру
    res.json(links)
  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const links = await Link.findById(req.params.id)
    res.json(links)
  } catch (e) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
  }
})

module.exports = router
