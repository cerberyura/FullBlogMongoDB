import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import {registerValidation, loginValidation, postCreateValidation} from './validations.js';

import {checkAuth, handleValidationErrors} from './utils/index.js';
import {getMe, login, register} from "./controllers/UserController.js";
import {create, getAll, getLastTags, getOne, remove, update} from './controllers/PostController.js';

mongoose.connect('mongodb://localhost:27017/blog')
  .then(() => console.log('DB Ok'))
  .catch((err) => console.log('DB Error', err));


const app = express();

const  storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads'); //вказуємо шлях куди зберігати фото
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname); // перед збереженням обяснює назву файла
  },
});

const upload = multer({storage}); // приміняємо 'storage multer'  на express

app.use(express.json()); //Дозволить читати  в JSON наші запроси
app.use(cors());
app.use('/uploads', express.static('uploads')); // получення get запиту на статичний фвйл

app.post('/auth/login', loginValidation, handleValidationErrors, login); //робимо авторизацію
app.post('/auth/register', registerValidation, handleValidationErrors, register);// робимо реєстрацію
app.get('/auth/me', checkAuth, getMe); //получаємо інформацію про користувача

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', getLastTags); //получаю всі статті
app.get('/posts', getAll); //получаю всі статті
app.get('/posts/tags', getLastTags); //получаю тегів
app.get('/posts/:id', getOne); //получаю одну статтю
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create); // створюємо статтю
app.delete('/posts/:id', checkAuth, remove); //видалення статті
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors,  update); //обновлення статті

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log('Server OK');
  }
});