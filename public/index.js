document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/data')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('data');
      
      // Check if data is an array and has items
      if (!Array.isArray(data) || data.length === 0) {
        console.error('No data found or data is not an array');
        return;
      }
      
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
        id.textContent = item._id;
        listingUrl.textContent = item.listing_url;
        name.textContent = item.name;
        interaction.textContent = item.interaction;
        property_type.textContent = item.property_type;
        room_type.textContent = item.room_type;
        bed_type.textContent = item.bed_type;
        minimum_nights.textContent = item.minimum_nights;
        maximum_nights.textContent = item.maximum_nights;
        cancellation_policy.textContent = item.cancellation_policy;
        accommodates.textContent = item.accommodates;
        bedrooms.textContent = item.bedrooms;
        beds.textContent = item.beds;
        number_of_reviews.textContent = item.number_of_reviews;
        bathrooms.textContent = JSON.stringify(item.bathrooms.$numberDecimal);
        price.textContent = JSON.stringify(item.price.$numberDecimal);
        security_deposit.textContent = JSON.stringify(item.security_deposit.$numberDecimal);
        cleaning_fee.textContent = JSON.stringify(item.cleaning_fee.$numberDecimal);
        extra_people.textContent = JSON.stringify(item.extra_people.$numberDecimal);
        guests_included.textContent = JSON.stringify(item.guests_included.$numberDecimal);
        host_name.textContent = item.host ? item.host.host_name : 'N/A';  
        addressMarket.textContent = item.address? item.address.market : 'N/A';

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
    })
    .catch(error => console.error('Failed to fetch data:', error));
});



    