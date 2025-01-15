// Client side javascript file

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

      try {
        //Fetch task data from the server
        const response = await fetch(`/edittask/${taskId}`);
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch task data');
        }

        // Wait for the JSON response from back-end with task information
        const task = await response.json();
        console.log(task);

        // Task data variables
        const title = task.task_name;
        const description = task.task_description;
        const due_date = new Date(task.task_due_date).toISOString().split('T')[0]; // Date reformatted for HTML output
        const category_id = task.category_id;
        const priority_id = task.priority_id;
        const status_id = task.status_id;

        // Populate modal field
        document.getElementById('edit-task-title').value = title;
        document.getElementById('edit-task-description').value = description;
        document.getElementById('edit-task-due-date').value = due_date;
        document.getElementById('edit-task-category').value = category_id;
        document.getElementById('edit-task-priority').value = priority_id;
        document.getElementById('edit-task-status').value = status_id;

        // Update the form's action attribute with the task ID
        updateForm.action = `/edittask/${taskId}`;
        deleteForm.action = `/deletetask/${taskId}`;

        // Programmatically show the modal
        const modal = new bootstrap.Modal(document.getElementById('edittask'));
        modal.show();
      } catch (error) {
        console.log(error);
      }
    });
  });
});
