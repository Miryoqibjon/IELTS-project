const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Mock данных (в реальном проекте используй базу данных)
const users = [];

// Регистрация
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (users.find(user => user.email === email)) {
        res.json({ success: false, message: 'Пользователь с таким email уже существует' });
    } else {
        users.push({ email, password });
        res.json({ success: true });
    }
});

// Вход
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Неверный email или пароль' });
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});