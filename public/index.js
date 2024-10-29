document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('property-form');
  const tableBody = document.getElementById('data'); // Table body for initial display
  const resultsContainer = document.getElementById('results'); // Card container for filtered display
  const listingTitle = document.getElementById('listing-title');

  // Function to fetch and display properties based on query parameters
  function fetchProperties(query = '', isFiltered = false) {
    console.log(`fetchProperties called with query: ${query}`); // Debug log

    fetch(`/api/data${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Clear previous rows or cards
        tableBody.innerHTML = '';
        resultsContainer.innerHTML = '';

        // Check if data is empty and if we're in filtered (card) view
        if (isFiltered && (!Array.isArray(data) || data.length === 0)) {
          listingTitle.textContent = "0 Listings that match your Preference"; // Show message if no results in filtered view
          tableBody.closest('table').style.display = 'none';
          resultsContainer.style.display = 'block';
          return;
        }
        
        if (!Array.isArray(data) || data.length === 0) {
          console.error('No data found or data is not an array');
          return;
        }


        if (isFiltered) {
          // Update title with the number of listings
          listingTitle.textContent = `${data.length} Listings that match your Preference`;

          // Hide the table and display cards
          tableBody.closest('table').style.display = 'none';
          resultsContainer.style.display = 'block';

          // Display each item in card format
          data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3', 'p-3', 'border');

            // Property Name as a link
            const title = document.createElement('a');
            title.href = `/bookings.html?listing_id=${item._id}`;
            title.classList.add('h5', 'text-primary');
            title.textContent = item.name || 'No Name Available';

            // Summary
            const summary = document.createElement('p');
            summary.textContent = item.summary || 'No summary available';

            // Daily Rate
            const dailyRate = document.createElement('p');
            dailyRate.textContent = `Daily Rate: ${item.price?.$numberDecimal || 'N/A'}`;

            // Customer Rating
            const rating = document.createElement('p');
            rating.textContent = `Customer Rating: ${item.review_scores?.review_scores_rating || 'N/A'}`;

            // Append elements to the card
            card.appendChild(title);
            card.appendChild(summary);
            card.appendChild(dailyRate);
            card.appendChild(rating);
            resultsContainer.appendChild(card);
          });

        } else {
          
          // Display in table format
          tableBody.closest('table').style.display = 'table';
          resultsContainer.style.display = 'none';
          data.forEach(item => {
            const row = document.createElement('tr');

            // Creating cells for each data field
            const id = document.createElement('td');
            const listingUrl = document.createElement('td');
            const name = document.createElement('td');
            const interaction = document.createElement('td');
            const property_type = document.createElement('td');
            const room_type = document.createElement('td');
            const bed_type = document.createElement('td');
            const minimum_nights = document.createElement('td');
            const maximum_nights = document.createElement('td');
            const cancellation_policy = document.createElement('td');
            const accommodates = document.createElement('td');
            const bedrooms = document.createElement('td');
            const beds = document.createElement('td');
            const number_of_reviews = document.createElement('td');
            const bathrooms = document.createElement('td');
            const price = document.createElement('td');
            const security_deposit = document.createElement('td');
            const cleaning_fee = document.createElement('td');
            const extra_people = document.createElement('td');
            const guests_included = document.createElement('td');
            const host_name = document.createElement('td');
            const addressMarket = document.createElement('td');

            // Assigning data to each cell
            id.textContent = item._id || 'N/A';
            listingUrl.textContent = item.listing_url || 'N/A';
            name.textContent = item.name || 'N/A';
            interaction.textContent = item.interaction || 'N/A';
            property_type.textContent = item.property_type || 'N/A';
            room_type.textContent = item.room_type || 'N/A';
            bed_type.textContent = item.bed_type || 'N/A';
            minimum_nights.textContent = item.minimum_nights || 'N/A';
            maximum_nights.textContent = item.maximum_nights || 'N/A';
            cancellation_policy.textContent = item.cancellation_policy || 'N/A';
            accommodates.textContent = item.accommodates || 'N/A';
            bedrooms.textContent = item.bedrooms || 'N/A';
            beds.textContent = item.beds || 'N/A';
            number_of_reviews.textContent = item.number_of_reviews || 'N/A';
            bathrooms.textContent = item.bathrooms?.$numberDecimal || 'N/A';
            price.textContent = item.price?.$numberDecimal || 'N/A';
            security_deposit.textContent = item.security_deposit?.$numberDecimal || 'N/A';
            cleaning_fee.textContent = item.cleaning_fee?.$numberDecimal || 'N/A';
            extra_people.textContent = item.extra_people?.$numberDecimal || 'N/A';
            guests_included.textContent = item.guests_included?.$numberDecimal || 'N/A';
            host_name.textContent = item.host ? item.host.host_name : 'N/A';
            addressMarket.textContent = item.address ? item.address.market : 'N/A';

            // Appending cells to the row
            row.appendChild(id);
            row.appendChild(listingUrl);
            row.appendChild(name);
            row.appendChild(interaction);
            row.appendChild(property_type);
            row.appendChild(room_type);
            row.appendChild(bed_type);
            row.appendChild(minimum_nights);
            row.appendChild(maximum_nights);
            row.appendChild(cancellation_policy);
            row.appendChild(accommodates);
            row.appendChild(bedrooms);
            row.appendChild(beds);
            row.appendChild(number_of_reviews);
            row.appendChild(bathrooms);
            row.appendChild(price);
            row.appendChild(security_deposit);
            row.appendChild(cleaning_fee);
            row.appendChild(extra_people);
            row.appendChild(guests_included);
            row.appendChild(host_name);
            row.appendChild(addressMarket);

            // Adding the row to the table body
            tableBody.appendChild(row);
          });
          // Show the table initially
          tableBody.style.display = 'table-row-group';
          resultsContainer.style.display = 'none';
        }
      })
      .catch(error => console.error('Failed to fetch data:', error));
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form input values
    const location = document.getElementById('location').value;
    const propertyType = document.getElementById('property-type').value;
    const bedrooms = document.getElementById('bedrooms').value;

    // Construct query string based on filters
    const queryParams = new URLSearchParams();
    if (location) queryParams.append('location', location);
    if (propertyType) queryParams.append('property_type', propertyType);
    if (bedrooms) queryParams.append('bedrooms', bedrooms);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    console.log(`Query string built: ${queryString}`); // Debug log

    // Fetch and display the filtered data in card format
    fetchProperties(queryString, true);
  });

  // Initial fetch to display the first 20 listings on page load
  fetchProperties();

  // Property type dropdown
  fetch('/api/property-types')
    .then(response => response.json())
    .then(propertyTypes => {
      const propertyTypeSelect = document.getElementById('property-type');
      
      propertyTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        propertyTypeSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Failed to fetch property types:', error));

  // No. of bedrooms dropdown
  fetch('/api/no-of-bedrooms')
    .then(response => response.json())
    .then(bedroomCounts => {
      const bedroomsSelect = document.getElementById('bedrooms');
      
      bedroomCounts.forEach(count => {
        const option = document.createElement('option');
        option.value = count;
        option.textContent = count;
        bedroomsSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Failed to fetch number of bedrooms:', error));
});
