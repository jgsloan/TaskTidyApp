const axios = require('axios');
const bcrypt = require('bcrypt');

// Dashboard / homepage of web application which includes metrics of users tasks
exports.getHome = (req, res) => {
  const { isloggedin, role, user_id, name } = req.session;
  console.log(`this is the user role: ${role}`);
  console.log(`This is the user id: ${user_id}`);
  console.log(`This is the users name: ${name}`);

  if (isloggedin && role === 'Admin') {
    // create API endpoints
    const endpoint = 'http://localhost:3002/tasks';
    const completionEndpoint = 'http://localhost:3002/tasks/completed-last-7-days';

    // fetch all tasks and completed tasks concurrently
    Promise.all([axios.get(endpoint), axios.get(completionEndpoint)])

      .then(([tasksResponse, completionResponse]) => {
        const tasksData = tasksResponse.data.result;
        const completionData = completionResponse.data.result;
        console.log(tasksData);
        console.log(completionData);

        // Count task status using reduce
        const taskCounts = tasksData.reduce(
          (acc, { status_name }) => {
            acc[status_name] = (acc[status_name] || 0) + 1; // Increment the count for the status
            return acc; // Return updated accumulator
          },
          { 'Not Started': 0, 'In Progress': 0, Completed: 0, Cancelled: 0 } // Initial object
        );

        console.log(taskCounts);

        res.render('dashboard', {
          task: tasksData,
          completionData: completionData,
          taskCounts: taskCounts,

          currentPage: 'dashboard',
          session: { role, name, user_id },
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        res.status(500).render('error', {
          message: 'There was an issue loading your dashboard. Please try again later.',
          error: error.message,
        });
      });
  } else if (isloggedin) {
    // Create API endpoints
    const endpoint = `http://localhost:3002/tasks/user/${user_id}`;
    const completionEndpoint = `http://localhost:3002/tasks/${user_id}/completed-last-7-days`;

    // fetch all tasks and completed tasks concurrently
    Promise.all([axios.get(endpoint), axios.get(completionEndpoint)])

      .then(([tasksResponse, completionResponse]) => {
        const tasksData = tasksResponse.data.result;
        const completionData = completionResponse.data.result;
        console.log(tasksData);
        console.log(completionData);

        // Count task status using reduce
        const taskCounts = tasksData.reduce(
          (acc, { status_name }) => {
            acc[status_name] = (acc[status_name] || 0) + 1; // Increment the count for the status
            return acc; // Return updated accumulator
          },
          { 'Not Started': 0, 'In Progress': 0, Completed: 0, Cancelled: 0 } // Initial object
        );

        console.log(taskCounts);

        res.render('dashboard', {
          task: tasksData,
          completionData: completionData,
          taskCounts: taskCounts,

          currentPage: 'dashboard',
          session: { role, name },
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        res.status(500).send('Error fetching data');
      });
  } else {
    res.redirect('/login');
  }
};

// Gets all tasks of loggedin user and loads a taskboard view
exports.getTaskBoard = (req, res) => {
  const { isloggedin, role, user_id } = req.session;
  console.log(`this is the user role: ${role}`);
  console.log(`This is the user id: ${user_id}`);
  // store error so it can passed to the front end on page load
  const errorMessage = req.session.error;
  //clear error from session so it remains only for one request
  req.session.error = null;
  console.log(errorMessage);

  if (isloggedin && role === 'Admin') {
    const endpoint = 'http://localhost:3002/tasks';

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('tasksboard', {
          task: data,
          currentPage: 'tasksboard',
          session: { role, user_id },
          error: errorMessage,
          errorMessage: null,
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        req.session.error = 'Unable to load tasks. Please try again later';
        res.redirect('/tasksboard');
      });
  } else if (isloggedin) {
    const endpoint = `http://localhost:3002/tasks/user/${user_id}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('tasksboard', {
          task: data,
          currentPage: 'tasksboard',
          session: { role, user_id },
          error: errorMessage,
          errorMessage: null,
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        req.session.error = 'Unable to load tasks. Please try again later';
        res.redirect('/tasksboard');
      });
  } else {
    res.redirect('/login');
  }
};

// gets all user tasks and displays a table view
exports.getTaskTable = (req, res) => {
  const { isloggedin, role, user_id } = req.session;
  console.log(`this is the user role: ${role}`);
  console.log(`This is the user id: ${user_id}`);
  // store error so it can passed to the front end on page load
  const errorMessage = req.session.error;
  //clear error from session so it remains only for one request
  req.session.error = null;

  if (isloggedin && role === 'Admin') {
    const endpoint = 'http://localhost:3002/tasks';

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('taskstable', {
          task: data,
          currentPage: 'taskstable',
          session: { role, user_id },
          error: errorMessage,
          errorMessage: null,
        });
      })
      .catch((error) => {
        console.log(`Error naking API request: ${error}`);
        req.session.error = 'Unable to load tasks. Please try again later';
        res.redirect('/taskstable');
      });
  } else if (isloggedin) {
    const endpoint = `http://localhost:3002/tasks/user/${user_id}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('taskstable', {
          task: data,
          currentPage: 'taskstable',
          session: { role, user_id },
          error: errorMessage,
          errorMessage: null,
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        req.session.error = 'Unable to load tasks. Please try again later';
        res.redirect('/taskstable');
      });
  } else {
    res.redirect('/login');
  }
};

// sorted tasks and displays the relevant webpage (table or dashboard dynamically)
exports.getSortedTasks = (req, res) => {
  const { isloggedin, role, user_id } = req.session;
  const query = req.query.sort;
  console.log('🔍 Full request URL:', req.originalUrl);
  console.log(`This is the content of the query string: ${query}`);
  console.log(`this is the user role: ${role}`);
  console.log(`This is the user id: ${user_id}`);
  // store error so it can passed to the front end on page load
  const errorMessage = req.session.error;
  //clear error from session so it remains only for one request
  req.session.error = null;

  if (isloggedin && role === 'Admin') {
    const endpoint = `http://localhost:3002/sort/${user_id}?sort=${query}&role=${role}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('taskstable', {
          task: data,
          currentPage: 'taskstable',
          session: { role, user_id },
          error: errorMessage,
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        req.session.error = 'Unable to load sorted tasks. Please try agian later.';
        res.redirect('/taskstable');
      });
  } else if (isloggedin) {
    const endpoint = `http://localhost:3002/sort/${user_id}?sort=${query}&role=${role}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('taskstable', {
          task: data,
          currentPage: 'taskstable',
          session: { role, user_id },
          error: errorMessage,
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        req.session.error = 'Unable to load sorted tasks. Please try agian later.';
        res.redirect('/taskstable');
      });
  } else {
    res.redirect('/login');
  }
};

exports.filterTasks = (req, res) => {
  const { isloggedin, role, user_id } = req.session;
  const query = req.query.filter;
  const filterType = req.query.type;

  console.log('🔍 Full request URL:', req.originalUrl);
  console.log(`This is the content of the query string: ${query}`);
  console.log(`The filter type is: ${filterType}`);
  console.log(`this is the user role: ${role}`);
  console.log(`This is the user id: ${user_id}`);

  if (isloggedin && role === 'Admin') {
    const endpoint = `http://localhost:3002/filter/${user_id}?type=${filterType}&filter=${query}&role=${role}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('taskstable', {
          task: data,
          currentPage: 'taskstable',
          session: { role, user_id },
          error: req.session.error || '',
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        req.session.error = 'Unable to load filtered tasks. Please try agian later.';
        res.redirect('/taskstable');
      });
  } else if (isloggedin) {
    const endpoint = `http://localhost:3002/filter/${user_id}?type=${filterType}&filter=${query}&role=${role}`;

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('taskstable', {
          task: data,
          currentPage: 'taskstable',
          session: { role, user_id },
          error: req.session.error || '',
        });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        req.session.error = 'Unable to load filtered tasks. Please try agian later.';
        res.redirect('/taskstable');
      });
  } else {
    res.redirect('/login');
  }
};

exports.addTask = (req, res) => {
  console.log(req.body);
  const { isloggedin, user_id } = req.session;
  const { title, description, duedate, category, priority } = req.body;

  // Check if essential data is present
  if (!title || !description || !duedate || !category || !priority) {
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!duedate) missingFields.push('duedate');
    if (!category) missingFields.push('category');
    if (!priority) missingFields.push('priority');

    console.log('Missing required fields');
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  const vals = { title, description, duedate, category, priority, user_id };
  console.log(vals);

  if (isloggedin) {
    const endpoint = 'http://localhost:3002/tasks/new';

    // Get the source page from the query parameter, default to '/taskboard' if not provided
    const redirectPage = req.query.source || '/taskboard';
    console.log(redirectPage);

    axios
      .post(endpoint, vals)
      .then((response) => {
        const data = response.data;
        console.log(data);
        res.json({ success: true, redirect: redirectPage });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
        res.status(500).json({ success: false, error: 'Failed to add task' });
      });
  } else {
    console.log('User not logged in');
    res.redirect('/login'); // Redirect to login if the user is not logged in
  }
};

exports.getTask = (req, res) => {
  const taskId = req.params.id;
  const { role } = req.session;

  const endpoint = `http://localhost:3002/tasks/${taskId}`;

  axios
    .get(endpoint)
    .then((response) => {
      const data = response.data.result;
      res.json({ task: data, role: role });
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
      res.status(500).json({ error: 'Failed to fetch task data' });
    });
};

exports.editTask = (req, res) => {
  const taskId = req.params.id;
  const vals = ({ title, description, duedate, category, priority, status } = req.body);

  const endpoint = `http://localhost:3002/tasks/${taskId}`;

  // Get the source page from the query parameter, default to '/taskboard' if not provided
  const redirectPage = req.query.source || '/taskboard';
  console.log(redirectPage);

  axios
    .patch(endpoint, vals)
    .then((response) => {
      if (response.status === 200) {
        res.redirect(redirectPage);
      } else {
        req.session.error = 'Failed to update the task. Please try again.';
        res.redirect(`/tasks/edit/${taskId}`);
      }
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
      req.session.error =
        'An error occurred while updating the task. Please try again later.';
      res.redirect(`/tasks/edit/${taskId}`);
    });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  const currentStatus = req.query.currentstatus;
  console.log(currentStatus);

  if (parseInt(currentStatus) === 3) {
    req.session.error = 'You cannot delete a completed task!';
    res.redirect(req.query.source || '/taskboard');
    return;
  }

  const endpoint = `http:/localhost:3002/tasks/${taskId}`;

  // Get the source page from the query parameter, default to '/taskboard' if not provided
  const redirectPage = req.query.source || '/taskboard';
  console.log(redirectPage);

  axios
    .delete(endpoint)
    .then((response) => {
      if (response.status === 200) {
        // Successfully deleted, redirect to the previous page
        res.redirect(redirectPage);
      } else {
        req.session.error = 'Failed to delete the task. Please try again.';
        res.redirect(redirectPage);
      }
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
      req.session.error = 'Failed to delete the task!';
      res.redirect(redirectPage);
    });
};

exports.completeTask = (req, res) => {
  const taskId = req.params.id;

  const endpoint = `http://localhost:3002/tasks/complete/${taskId}`;

  axios
    .patch(endpoint)
    .then((response) => {
      if (response.status === 200) {
        // Task completed successfully
        console.log(response.data);
        res.redirect('/taskboard');
      } else {
        req.session.error = 'Failed to mark the task as complete.';
        res.redirect('/taskboard');
      }
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
      req.session.error =
        'An error occurred while completing the task. Please try again later.';
      res.redirect('/taskboard');
    });
};

exports.getLogin = (req, res) => {
  res.render('login', { passwordmatch: null, unauthorised: null, duplicate: null });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const vals = { email, password };

  const endpoint = `http://localhost:3002/user/login`;

  axios
    .post(endpoint, vals)
    .then((response) => {
      const data = response.data.result;
      console.log(data);
      const session = req.session;

      const storedPassword = data[0].user_password;
      console.log(`This is the hashed password:`, storedPassword);

      bcrypt
        .compare(password, storedPassword)
        .then((passwordMatched) => {
          if (passwordMatched) {
            session.isloggedin = true;
            session.user_id = data[0].user_id;
            session.role = data[0].role_type;
            session.name = data[0].name;
            console.log(session);

            res.redirect('/');
          } else {
            res.render('login', {
              passwordmatch: true,
              unauthorised: null,
              duplicate: null,
              errorMessage: 'Incorrect password. Please try again.',
            });
          }
        })
        .catch((err) => {
          console.error('Error comparing passwords:', err);
          res.render('login', {
            passwordmatch: null,
            unauthorised: null,
            errorMessage:
              'An error occurred while processing your login. Please try again.',
          });
        });
    })
    .catch((error) => {
      // Handle 401 errors from the login
      if (error.response && error.response.status === 401) {
        console.log('Invalid login credentials');
        res.render('login', {
          unauthorised: 'Invalid login credentials. Please try again.',
          passwordmatch: null,
          errorMessage: null,
        });
      } else if (error.response && error.response.status === 400) {
        // Handle 400 Bad Request errors
        console.log('Bad Request');
        res.render('login', {
          unauthorised: 'Invalid login request. Please check your details and try again.',
          passwordmatch: null,
          errorMessage: null,
        });
      } else {
        // Handle unexpected server errors
        console.log(`Error in login request: ${error}`);
        res.render('login', {
          unauthorised: 'Server error occurred, please try again later.',
          passwordmatch: null,
          errorMessage: null,
        });
      }
    });
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

exports.getRegister = (req, res) => {
  res.render('register', { unmatched: false, duplicate: null });
};

exports.postRegister = (req, res) => {
  // Store registration form data into variables
  const { name, email, username, firstpassword, secondpassword } = req.body;

  // Check both passwords match and send an unmatched boolean if false
  if (firstpassword !== secondpassword) {
    return res.render('register', { unmatched: true, duplicate: null });
  }

  bcrypt.hash(firstpassword, 10).then((hashedPassword) => {
    const vals = {
      name: name,
      email: email,
      username: username,
      user_password: hashedPassword,
    };
    console.log(vals);

    const endpoint = `http://localhost:3002/user`;

    axios
      .post(endpoint, vals)
      .then((response) => {
        const data = response.data;
        res.redirect('/login');
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          console.log(`error!!! username or email already exists!`);
          return res.render('register', {
            unmatched: false,
            duplicate: ' Username or email already exists. Try another one.',
          });
        }

        console.log(`Error making API request: ${error}`);
        return res.status(500).send('Internal Server Error');
      });
  });
};

exports.geterror = (req, res) => {
  res.status(400).send('Error!');
};

exports.get404 = (req, res) => {
  res.status(404);
  res.send('<h1>Page not found!</h1>');
};
