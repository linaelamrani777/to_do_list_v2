const API_URL = `${window.location.protocol}//${window.location.host}/api/auth`;

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Sign-up successful! You can now log in.');
        } else {
            alert(`Sign-up failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during sign-up:', error);
        alert('An error occurred during sign-up.');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem('token', data.token);
            alert('Login successful!');
            // Redirect or update UI after login
            window.location.href = '/index.html';
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
});
