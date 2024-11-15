const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

// Налаштування порту
const port = 3000;

// Створення серверу
const server = http.createServer((req, res) => {
    // Отримуємо URL запиту
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Обробка запитів на статичні файли (наприклад, CSS)
    if (pathname === '/style.css') {
        const filePath = path.join(__dirname, 'style.css');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
        return;
    }

    // Якщо користувач відправляє дані через форму (POST)
    if (req.method === 'POST' && pathname === '/submit') {
        let body = '';

        // Збираємо дані з тіла запиту
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            // Парсимо дані
            const data = querystring.parse(body);
            const userCode = data.confirmationCode.trim();

            // Перевірка наявності коду
            if (userCode) {
                // Читаємо поточні коди з файлу
                fs.readFile('codes.json', (err, fileData) => {
                    let codes = [];
                    if (err) {
                        if (err.code === 'ENOENT') {
                            console.log('File not found, creating new file.');
                        } else {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Server Error');
                            return;
                        }
                    } else {
                        codes = JSON.parse(fileData);
                    }

                    // Додаємо новий код до масиву
                    codes.push(userCode);

                    // Записуємо оновлені коди назад у файл
                    fs.writeFile('codes.json', JSON.stringify(codes, null, 2), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Server Error');
                            return;
                        }

                        // Відправляємо успішну відповідь
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Code added successfully!');
                    });
                });
            } else {
                // Якщо код порожній
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Please provide a valid code.');
            }
        });
    } else {
        // Відправляємо HTML форму
        if (pathname === '/') {
            fs.readFile('task.html', 'utf-8', (err, htmlData) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(htmlData);
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page not found');
        }
    }
});

// Запуск сервера
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
