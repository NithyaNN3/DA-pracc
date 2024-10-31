// Submit the form when the user clicks the submit button
const addForm = document.getElementById('addForm');
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get('listing_id');
console.log('Listing ID:', listingId);

addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (addForm.checkValidity()) {
    try {
      const checkin = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const mobile = document.getElementById('mobile').value;
      const postalAddr = document.getElementById('postalAddr').value;
      const resAddr = document.getElementById('resAddr').value;


      // booking data in the specified format
      const bookingData = {
        arrival_date: new Date(checkin).toISOString(),
        departure_date: new Date(checkout).toISOString(),
        client: {
          name: name,
          contact: {
            email_address: email,
            mobile_number: mobile
          },
          address: {
            postal_address: postalAddr,
            residential_address: resAddr
          }
        }
      };

      // Send a POST request to the API endpoint with listingId and bookingData
      const response = await fetch(`/api/data/bookings/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ booking: bookingData })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Redirect to the home page or show a success message after submission
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      document.getElementById('error-message').textContent = "Failed to submit booking. Please try again.";
    }
  } else {
    addForm.classList.add('was-validated');
  }
});
