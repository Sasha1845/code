document.getElementById('codeForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Запобігаємо стандартному відправленню форми

    const userCode = document.getElementById('confirmationCode').value.trim();
    const message = document.getElementById('message');

    if (userCode) {
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `confirmationCode=${userCode}`
        })
        .then(response => {
            console.log("Response received:", response); // Логування відповіді
            return response.text();
        })
        .then(text => {
            message.style.color = 'green';
            message.textContent = 'Code added to the list!';
            console.log("Server response:", text);
        })
        .catch(error => {
            message.style.color = 'red';
            message.textContent = 'There was an error!';
            console.error("Error:", error);
        });
    } else {
        message.style.color = 'red';
        message.textContent = 'Please enter a valid code.';
    }

    // Очистити поле вводу
    document.getElementById('confirmationCode').value = '';
});
