// Client side javascript file for adding a new task

// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // Select the form element for adding a new task
  const addTaskForm = document.querySelector('form');
  // Error message container inside the modal
  const errorMessageDiv = document.querySelector('#error-message');

  // Listen for the form submission event
  addTaskForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Clear any previous error messages
    errorMessageDiv.textContent = '';

    // Create a new FormData object from the form
    const formData = new FormData(this);

    // Convert FormData to URLSearchParams for proper form submission handling
    const urlEncodedData = new URLSearchParams();
    formData.forEach((value, key) => {
      urlEncodedData.append(key, value);
    });

    // Perform the fetch request to submit the task data
    try {
      const response = await fetch('/addtask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Ensure content type is URL encoded
        },
        body: urlEncodedData.toString(), // Send the URL-encoded data
      });

      // Wait for the response to be parsed as JSON
      const data = await response.json();
      console.log(data);

      // Handle the response from the server
      if (!response.ok || !data.success) {
        // Show errormessage in the modal
        errorMessageDiv.textContent =
          data.error || 'Failed to add the task. Please try again';
        errorMessageDiv.style.color = 'red';
        return; // Don't proceed with closing the modal or redirecting
      }

      // If the task was added successfully, redirect to the taskboard page
      if (data.success) {
        window.location.href = data.redirect || '/taskboard'; // Redirect to the given URL or default to '/taskboard'
      }
    } catch (error) {
      // Log any errors that occur during the fetch process
      console.error('Error:', error);
    }
  });
});
