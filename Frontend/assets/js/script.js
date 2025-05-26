const apiBase = '/api/auth';

// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Select the login form
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const updateForm = document.getElementById('update-form');
  const profileForm = document.getElementById('profile-form');

  if (loginForm) {
    // Add a submit event listener for login
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
      console.log('Login form submitted'); // Debugging output

      // Retrieve form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Debugging output for form values
      console.log('Email:', email);
      console.log('Password:', password);

      try {
        // Make a fetch call to the login API
        const response = await fetch(`${apiBase}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Login successful!');
          localStorage.setItem('token', data.token); // Save token to localStorage
          window.location.href = '/index.html'; // Redirect to dashboard
        } else {
          alert(`Error: ${data.message}`);
          localStorage.removeItem('token'); // Clear token if login fails
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      }
    });
  } else {
    console.error('Login form not found');
  }

  if (signupForm) {
    // Add a submit event listener for signup
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
      console.log('Signup form submitted'); // Debugging output

      // Retrieve form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Debugging output for form values
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Password:', password);

      try {
        // Make a fetch call to the signup API
        const response = await fetch(`${apiBase}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Signup successful!');
          window.location.href = '/signin/login.html'; // Redirect to login page
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup. Please try again.');
      }
    });
  } else {
    console.error('Signup form not found');
  }

  if(updateForm)
  {
    updateForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
      console.log('update form submitted'); // Debugging output

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to update your profile.');
        return;
      }
      // Retrieve form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Debugging output for form values
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Password:', password);
      // const name = updateForm.name.value.trim();
      // const email = updateForm.email.value.trim();
      // const password = updateForm.password.value;
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      if (Object.keys(updateData).length === 0) {
        alert('Please enter at least one field to update.');
        return;
      }

      try {
        // Make a fetch call to the signup API
        const response = await fetch(`${apiBase}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
          body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Profile updated successful!');
          window.location.href = '/'; // Redirect to login page
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Update error:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  if(profileForm)
    {
      profileForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        console.log('profile form submitted'); // Debugging output
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to delete your profile.');
          return;
        }

        const confirmDelete = confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        // Retrieve form values
        if(!confirmDelete) return;

        try {
          // Make a fetch call to the signup API

          const response = await fetch(`${apiBase}/delete`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`, // Include the token in the request headers
            }
          });

          const data = await response.json();

          if (response.ok) {
            alert('Profile deleted successful!');
            localStorage.removeItem('token');
            window.location.href = '/'; // Redirect to login page
          } else {
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error('Delete error:', error);
          alert('An error occurred. Please try again.');
        }
      });
    }
});

// Check if User is Logged In
window.onload = () => {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('login-link');
  const signupLink = document.getElementById('signup-link');

  // Check the current page
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes('login.html');
  const isSignupPage = currentPage.includes('signup.html');
  const isIndexPage = currentPage.includes('index.html');
  const isServicePage = currentPage.includes('services.html');

  if (token) {
    console.log('User is logged in.');
    // Hide login and signup links
    if (loginLink) loginLink.style.display = 'none';
    if (signupLink) signupLink.style.display = 'none';
  } else if (!isLoginPage && !isSignupPage && !isIndexPage & !isServicePage) {
    console.log('User is not logged in. Redirecting to login page...');
    const app_form = document.getElementById('appointment-form');
    if(app_form) {
      document.getElementById('service-selection').innerHTML = '<h2 style="color:red">Please login to book an appointment, redirecting you to login page now...</h2>';
      document.getElementsByTagName('button')[0].disabled = true;
      // document.getElementsByTagName('button')[0].className = 'disabled:opacity-50 disabled:bg-gray-400';
      document.querySelector('button[type="submit"]').style.backgroundColor = 'gray';
      document.querySelector('button[type="submit"]').style.color = 'lightgray';
      document.querySelector('button[type="submit"]').style.cursor = 'not-allowed';
    }
    // alert('User is not logged in. Redirecting to login page...');
    setTimeout(() => {
      // Redirect to login page
        window.location.href = '/signin/login.html';
    }, 5000);
    // Redirect to login page only if not already on login or signup page
    // window.location.href = '/signin/login.html';
  }
};
