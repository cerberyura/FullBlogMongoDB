import {body} from 'express-validator'

export const loginValidation = [
  body('email', 'Неправильний формат пошти ').isEmail(),
  body('password', 'Пароль повинен бути мінімум 5 символів').isLength({ min: 5}),
];

export const registerValidation = [
  body('email', 'Неправильний формат пошти ').isEmail(),
  body('password', 'Пароль повинен бути мінімум 5 символів').isLength({ min: 5}),
  body('fullName', 'В кажіть Імя').isLength({ min: 3}),
  body('avatarUrl', 'Не правильна силка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введіть заголовок статті').isLength({ min: 3}).isString(),
  body('text', 'Введіть текст статті').isLength({ min: 3}).isString(),
  body('tags', 'Неправильний формат тегів (укажіть масив)').optional().isString(),
  body('imageUrl', 'Неправильна силка на зображення ').optional().isString(),
];

