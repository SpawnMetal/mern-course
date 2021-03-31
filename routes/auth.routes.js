const {Router} = require('express')
const bcrypt = require('bcryptjs') // Хеширование паролей
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User') // Модель пользователя
const router = Router() // Роутинг и запросы post get

// /api/auth/register
router.post(
  '/register',
  [
    // Условия валидации
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6}),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req) // Так express-validator начинает валидировать входящие поля

      if (!errors.isEmpty())
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        })

      const {email, password} = req.body // Получаем с клиента body поля email и password

      const candidate = await User.findOne({email}) // Проверяем, есть ли уже email в БД

      if (candidate)
        return res
          .status(400)
          .json({message: 'Такой пользователь уже существует'})

      const hashedPassword = await bcrypt.hash(password, 12) // 12 - sold, соль
      const user = new User({email, password: hashedPassword})

      await user.save()

      res.status(201).json({message: 'Пользователь создан'})
    } catch (e) {
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req) // Так express-validator начинает валидировать входящие поля

      if (!errors.isEmpty())
        return res.status(400).json({
          errors: errors.array,
          message: 'Некорректные данные при входе в систему',
        })

      const {email, password} = req.body

      const user = await User.findOne({email})

      if (!user)
        return res.status(400).jsin({message: 'Пользователь не найден'})

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch)
        return res
          .status(400)
          .json({message: 'Неверный пароль, попробуйте снова'})

      const token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'), // Секретный пароль из конфига
        {expiresIn: '1h'} // Время жизни токена
      )

      res.json({token, userId: user.id}) // По умолчанию статус 200
    } catch (e) {
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
)

module.exports = router
