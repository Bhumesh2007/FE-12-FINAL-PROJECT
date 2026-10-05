const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

// Create demo admin account only if it does not already exist.
const users = getUsers();
if (!users.some(user => user.email === 'admin@gmail.com')) {
  users.push({
    id: 1,
    name: 'Administrator',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin'
  });
  saveUsers(users);
}

const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm');
    const message = document.getElementById('msg');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    if (password !== confirmPassword) {
      message.textContent = 'Passwords do not match.';
      return;
    }

    const existingUsers = getUsers();
    if (existingUsers.some(user => user.email === email)) {
      message.textContent = 'Email already registered.';
      return;
    }

    existingUsers.push({
      id: Date.now(),
      name,
      email,
      password,
      role: 'user'
    });

    saveUsers(existingUsers);
    message.textContent = 'Account created successfully. Redirecting to login...';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 700);
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const message = document.getElementById('msg');

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const user = getUsers().find(
      item => item.email === email && item.password === password
    );

    if (!user) {
      message.textContent = 'Invalid email or password.';
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    message.textContent = 'Login successful. Redirecting...';

    setTimeout(() => {
      window.location.href = user.role === 'admin'
        ? 'admin-dashboard.html'
        : 'user-dashboard.html';
    }, 400);
  });
}

const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    togglePassword.textContent = show ? 'Hide' : 'Show';
    togglePassword.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
}
