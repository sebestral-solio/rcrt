// Handling the Sign-Up Form submission
document.getElementById('create-acct-btn').addEventListener('click', () => {
    const email = document.getElementById('email-signup').value;
    const username = document.getElementById('username-signup').value;
    const password = document.getElementById('password-signup').value;
    const confirmPassword = document.getElementById('confirm-password-signup').value;
  
    // Send data to the backend
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        username,
        password,
        confirmPassword
      })
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message || data.error);
    })
    .catch(error => console.error('Error:', error));
  });
  
// Handling the Sign-In Form submission
document.getElementById('submit').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Send data to the backend
    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        // If login is successful, redirect to the /mcq page
        window.location.href = '/dashboard';
      } else {
        alert(data.error);
      }
    })
    .catch(error => console.error('Error:', error));
});
