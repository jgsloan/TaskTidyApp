// Client side javascript file for edit task functionality

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  const editButton = document.querySelectorAll('.edit-task'); // Creates a NodeList of all anchor tags on the page.
  const updateForm = document.querySelector('#updateform'); // Selects the updateform from inside the modal
  const deleteForm = document.querySelector('#deleteform'); // Selects the deleteform from inside the modal

  editButton.forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent the anchor's default navigation behaviour

      const taskId = button.getAttribute('data-id'); // Get task ID from anchor
      const role = button.getAttribute('data-role'); // Get role from session data
      console.log(`This the users role: ${role}`);

      // Capture the source page (store in sessionStorage)
      const sourcePage = window.location.pathname;
      sessionStorage.setItem('editTaskSource', sourcePage);

      try {
        //Fetch task data from the server
        const response = await fetch(`/edittask/${taskId}`);
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch task data');
        }

        // Wait for the JSON response from back-end with task information
        const { task, role } = await response.json();
        console.log(task);

        // Task data variables
        const title = task[0].task_name;
        const description = task[0].task_description;
        const due_date = new Date(task[0].task_due_date).toISOString().slice(0, 10);
        const category_id = task[0].category_id;
        const priority_id = task[0].priority_id;
        const status_id = task[0].status_id;

        // Populate modal field
        const inputElement = document.getElementById('edit-task-title');
        if (inputElement) {
          inputElement.value = title;
        } else {
          console.log('Element not found');
        }
        document.getElementById('edit-task-description').value = description;
        document.getElementById('edit-task-due-date').value = due_date;
        document.getElementById('edit-task-category').value = category_id;
        document.getElementById('edit-task-priority').value = priority_id;
        document.getElementById('edit-task-status').value = status_id;

        // Hide delete button if user is not an Admin
        if (role !== 'Admin') {
          const deleteButton = document.getElementById('deleteform');
          if (deleteButton) {
            deleteButton.style.display = 'none';
          }
        }

        // Update the form's action attribute with the task ID and sent source page as part of the query
        updateForm.action = `/edittask/${taskId}?source=${encodeURIComponent(
          sourcePage
        )}`;
        deleteForm.action = `/deletetask/${taskId}?source=${encodeURIComponent(
          sourcePage
        )}`;

        // Programmatically show the modal
        const modal = new bootstrap.Modal(document.getElementById('edittask'));
        modal.show();
      } catch (error) {
        console.log(error);
      }
    });
  });
});
