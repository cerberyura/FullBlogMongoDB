
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {

      const password = req.body.password;  //витягуємо наш пароль у перемінну password
      const salt = await bcrypt.genSalt(10); //алгоритм шифрування нашого пароля
      const hash = await bcrypt.hash(password, salt); //шифруємо пароль

      const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      });

      const user = await doc.save(); //створюємо користувача в mongodibi

      const token = jwt.sign({
          _id: user._id,

        }, 'secret123',
        {
          expiresIn: '30d',
        }
      );

      const {passwordHash, ...userData} = user._doc;

      res.json({
        ...userData,
        token
      });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося зареєструватися',
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email}); //провіряємо чи є такий емеїл

    if (!user) {
      return res.status(404).json({
        message: 'Користувача не знайдено',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); //провіряємо чи співпадають паролі

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Не правильний пароль або логін',
      });
    }

    const token = jwt.sign({
        _id: user._id,

      }, 'secret123',
      {
        expiresIn: '30d',
      }
    );

    const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося авторизуватися',
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Користувач не знайден'
      })
    }

    const {passwordHash, ...userData} = user._doc;

    res.json({...userData,});
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Немає доступу',
    })
  }
}