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
  const contactForm = document.getElementById('contact-form');
  const adminForm = document.getElementById('admin-form');
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
        setTimeout(() => {
          // Redirect to login page
          window.location.href = '/signin/login.html';
        }, 5000); // Redirect after 5 seconds
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

  if (adminForm) {
      const ddValues = ["Haircut", "Manicure" , "Pedicure", "Massage", "Facial", "Waxing", "Hair Coloring", "Hair Styling,Makeup"];
      var table = new Tabulator("#bookings-table", {
        data: [], // Your booking data here
        layout: "fitColumns",
        columns: [
          { title: "ID", field: "_id" },
          { title: "Name", field: "name", editor: "input" },
          { title: "Service", field: "service",
            editor: "select",
            editorParams: {
              values: ddValues,
            },
          },
          { title: "Date",
            field: "date",
            formatter: (cell) => {
              const value = cell.getValue();
              if (!value) return "";
              const pre = value.split("T")[0]; // Get the date part from ISO string
              const parts = pre.split("-");
              return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
            },
            editor: flatpickrEditor("date"),
          },
          { title: "Time",
            field: "time",
            formatter: (cell) => {
              const value = cell.getValue();
              if (!value) return "";
              const [h, m] = value.split(":");
              return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
            },
            editor: flatpickrEditor("time"),
          },
          { title: "Action", formatter: "buttonCross", width: 100, align: "center", cellClick: (e, cell) => {
              const id = cell.getRow().getData()._id;
              deleteBooking(id); // Your delete logic here
            }
          },
        ],
      });

      try {
        const data = await getBookings(); // Fetch bookings data and populate the table
        table.setData(data);

        table.on("cellEdited", async (cell) => {
          const field = cell.getField();
          let value = cell.getValue();
          if (field === "date") {
            value = formatDateToISO(value);
          }

          const va = {
            name: field === 'name'? value : cell.getRow().getData().name,
            service: field === 'service'? value : cell.getRow().getData().service,
            date: field === 'date' ? value : cell.getRow().getData().date,
            time: field === 'time' ? value : cell.getRow().getData().time,
          };
          updateBooking(cell.getRow().getData()._id, va); // Update the booking with the new value
        });
      } catch (error) {
        console.error('Admin form error:', error);
        alert('An error occurred while fetching bookings. Please try again.');
      }
  }
});

const formatDateToISO = (dateStr) => {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

const formatDateForFlatpickr = (isoDateString) =>{
  if (!isoDateString) return null;
  const date = new Date(isoDateString);
  if (isNaN(date)) return null;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // d/m/Y format
}

const flatpickrEditor = (mode) => {
  return function (cell, onRendered, success, cancel) {
    const input = document.createElement("input");
    input.style.width = "100%";

    // Parse the initial value into a valid format for Flatpickr
    let initialValue = cell.getValue();
    if (mode === "date") {
      if (initialValue) {
         const parts = initialValue.split("-"); // from 'YYYY-MM-DD'
         if (parts.length === 3) {
          initialValue = `${parts[2]}/${parts[1]}/${parts[0]}`; // 'DD/MM/YYYY'
        }
        initialValue = formatDateForFlatpickr(initialValue);
      }
    }

    if (mode === "time") {
      // Ensure time is in 'HH:mm' format
      initialValue = initialValue || "00:00";
    }

    input.value = initialValue || "";
    onRendered(() => input.focus());

    const fp = flatpickr(input, {
      enableTime: mode === "time",
      noCalendar: mode === "time",
      dateFormat: mode === "time" ? "H:i" : "d/m/Y",
      time_24hr: true,
      defaultDate: initialValue || null,
      onClose: () => {
        success(input.value);
      },
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        success(input.value);
      } else if (e.key === "Escape") {
        cancel();
      }
    });

    return input;
  };
}

const logout = () => {
  // Clear the token from localStorage
  if(confirm('Are you sure you want to log out?') && localStorage.getItem('token')) {
    localStorage.removeItem('token');
    console.log('User logged out successfully.');
    alert('You have been logged out successfully.');
    window.location.href = '/';
  }
}

const forceLogout = () => {
  // Clear the token from localStorage
  localStorage.removeItem('token');
  console.log('User force logged out successfully.');
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

const getBookings = async () => {
  try {
    const token = getToken();
    if(token === null) { alert('You must be logged in to view bookings. Redirecting to login page...');
      setTimeout(() => {
        forceLogout();
      }, 3000); // Redirect after 3 seconds
      window.location.href = '/signin/login.html'; // Redirect to login page
      return;
    }
    const response = await fetch('/api/appointments/allbookings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();

    if (response.ok) {
      return data.bookings; // Return the bookings data
    } else {
      console.error('Failed to fetch bookings:', data.error);
      // if(data.error) alert('Session expired, please login again.');
      if(data.message == 'Not authorized, token failed' && data.error == 'jwt expired') {
        alert('Session expired, You are not authorized to view this page. Redirecting to login page...');
        forceLogout(); // Call force logout function to clear token and redirect
        setTimeout(() => {
          window.location.href = '/signin/login.html';
        }, 3000);
      }
      else if(data.error) {
        alert(`Error: ${data.error}`);
      }
      return [];
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    alert('An error occurred while fetching bookings. Please try again.');
    return [];
  }
}

const deleteBooking = async (id) => {
  try {
    const token = getToken();
    if(token === null) { alert('You must be logged in to delete a booking. Redirecting to login page...');
      setTimeout(() => {
        forceLogout();
      }, 3000); // Redirect after 3 seconds
      window.location.href = '/signin/login.html'; // Redirect to login page
      return;
    }
    const confirmDelete = confirm('Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    const url = `/api/appointments/delete/${id}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || 'Booking deleted successfully.');
    } else {
      alert(result.error || 'Failed to delete booking.');
    }
    window.location.reload();
  } catch (error) {
    console.error('Error deleting booking:', error);
    alert('An error occurred while deleting the booking. Please try again.');
    return;
  }
}

const updateBooking = async (id, updatedData) => {
  try {
    const token = getToken();
    if(token === null) { alert('You must be logged in to update a booking. Redirecting to login page...');
      setTimeout(() => {
        forceLogout();
      }, 3000); // Redirect after 3 seconds
      window.location.href = '/signin/login.html'; // Redirect to login page
      return;
    }
    const url = `/api/appointments/update/${id}`;
    const response = fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    const result = await response;
    if (result.ok) {
      // alert('Booking updated successfully!');
      console.log('Booking updated successfully.');
    } else {
      alert(`Error updating booking: ${result.message}`);
      setTimeout(() => {
        window.location.reload(); // Reload the page to reflect changes
      }, 3000); // Reload after 3 seconds
    }
  }
  catch (error) {
    console.error('Error updating booking:', error);
    alert('An error occurred while updating the booking. Please try again.');
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
  const userDropdown = document.getElementById('user-dropdown');
  const userName = document.getElementById('user-name');
  const usernameText= document.getElementById('username-text');
  const dropdownMenu = document.getElementById('dropdown-menu');

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

    userDropdown.classList.remove('hidden');
    usernameText.innerText = decoded.name || 'User';
    userName.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', (event) => {
      if (!userDropdown.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });

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
