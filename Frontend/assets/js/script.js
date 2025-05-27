const apiBase = '/api/auth';
const apiOther = '/api';

// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', async () => {
  // Select the login form
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const updateForm = document.getElementById('update-form');
  const profileForm = document.getElementById('profile-form');
  const appointmentForm = document.getElementById('appointment-form');
  const contactForm = document.getElementById('contact-form'); // Assuming you have a contact form
  const token = getToken();

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
  }

  if(updateForm)
  {
    try {
      // Make a fetch call to the signup API
      const response = await fetch(`${apiBase}/view`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User data:', data.user);
        // Populate the form fields with user data
        document.getElementById('name').value = data.user.name || '';
        document.getElementById('email').value = data.user.email || '';
        // Password field should not be pre-filled for security reasons
        // document.getElementById('password').value = ''; // Keep password field empty
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred. Please try again.');
    }

    updateForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
      console.log('update form submitted'); // Debugging output

      if (!token) {
        alert('You must be logged in to update your profile.');
        return;
      }
      // Retrieve form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

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
    const decodedToken = decodeToken();
    if(decodedToken)
      decodedToken.role === 'admin' ?
        profileForm.classList.add('hidden')
        : profileForm.classList.remove('hidden');
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

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const service = document.getElementById('service').value;
      let date = document.getElementById('date').value;
      data = formatDate(date);
      console.log('Selected date:', date);''
      const time = document.getElementById('time').value;

      try {
        console.log('Sending data:', { name, service, date, time });

        // Replace with your backend API endpoint
        const response = await fetch('/api/appointments/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, service, date, time }),
        });

        if (response.ok) {
          const result = await response.json();
          // alert(`Appointment booked successfully! ID: ${result.appointment._id}`);
          window.location.href = `./confirmation.html?id=${result.appointment._id}&service=${result.appointment.service}&date=${result.appointment.date}&time=${result.appointment.time}&name=${result.appointment.name}`; // Pass ID to confirmation page
        } else {
          const error = await response.json();
          console.error('Error response:', error);
          alert(`Error: ${error.error}`);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('An error occurred while booking the appointment. Please try again.');
      }
    });
    const service = getUrlParameter('service');
      if (service) {
        const serviceDropdown = document.getElementById('service');
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].value === service) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }
      if(!token) {
        document.getElementById('service-selection').innerHTML = '<h2 style="color:red">Please login to book an appointment, redirecting you to login page now...</h2>';
        document.getElementsByTagName('button')[0].disabled = true;
        // document.getElementsByTagName('button')[0].className = 'disabled:opacity-50 disabled:bg-gray-400';
        document.querySelector('button[type="submit"]').style.backgroundColor = 'gray';
        document.querySelector('button[type="submit"]').style.color = 'lightgray';
        document.querySelector('button[type="submit"]').style.cursor = 'not-allowed';
      }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Contact form submitted'); // Debugging output

    // Retrieve form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Debugging output for form values
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    try {
      // Make a fetch call to the contact API (adjust the endpoint as needed)
      const response = await fetch(`${apiOther}/enquire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Your enquiry has been sent successfully!');
        contactForm.reset(); // Reset the form after successful submission
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      alert('An error occurred while sending your message. Please try again.');
    }
  });
  }

});

const logout = () => {
  // Clear the token from localStorage
  if(confirm('Are you sure you want to log out?') && localStorage.getItem('token')) {
    localStorage.removeItem('token');
    console.log('User logged out successfully.');
    alert('You have been logged out successfully.');
    window.location.href = '/';
  }
}

// Function to get URL parameter value
const getUrlParameter = (name) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
}

const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');  // Ensure 2-digit day
      const month = String(date.getMonth() + 1).padStart(2, '0');  // Ensure 2-digit month
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
}

// Capitalize first letter of service name
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage.');
    return null;
  }
  return token;
}

const decodeToken = () => {
  const token = getToken();
  if (!token) {
    console.error('No token found to decode.');
    return null;
  }
  try {
    return jwt_decode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

// Check if User is Logged In
window.onload = () => {
  const token = getToken();
  const loginLink = document.getElementById('login-link');
  const signupLink = document.getElementById('signup-link');
  const adminLink = document.getElementById('admin-link');
  const logoutLink = document.getElementById('logout-link');
  const profilelink = document.getElementById('profile-link');

  const appointmentId = getUrlParameter('id');
  const service = getUrlParameter('service');
  const date = getUrlParameter('date');
  const time = getUrlParameter('time');
  const name = getUrlParameter('name');

  if (appointmentId && service && date && time && name) {
    document.getElementById('appointment-id').innerText = appointmentId;
    document.getElementById('service').innerText = capitalizeFirstLetter(service);
    document.getElementById('date').innerText = date;
    document.getElementById('time').innerText = time;
    document.getElementById('name').innerText = name;
  } else {
    // document.getElementById('error-message').innerText = 'Invalid appointment details.';
  }

  if (token) {
    console.log('User is logged in.');
    const decoded = decodeToken();
    // Hide login and signup links
    loginLink.classList.add('hidden');
    signupLink.classList.add('hidden');
    profilelink.classList.remove('hidden');
    logoutLink.classList.remove('hidden');
    // Show admin link if role is admin
    if (decoded.role === 'admin') {
      adminLink.classList.remove('hidden');
    }
  } else {
    console.log('User is not logged in.');
    // Show login and signup links
    if (loginLink) loginLink.classList.remove('hidden');
    if (signupLink) signupLink.classList.remove('hidden');
    logoutLink.classList.add('hidden');
    adminLink.classList.add('hidden');
    setTimeout(() => {
      // Redirect to login page
      if (!loginLink)
        window.location.href = '/signin/login.html';
    }, 5000);
  }
};
