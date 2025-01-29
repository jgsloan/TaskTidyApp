const axios = require('axios');

exports.getHome = (req, res) => {
  const { isloggedin } = req.session;

  if (isloggedin) {
    res.status(200);
    res.render('dashboard', { currentPage: 'dashboard' });
  } else {
    res.redirect('/login');
  }
};

exports.getTaskBoard = (req, res) => {
  const { isloggedin } = req.session;

  if (isloggedin) {
    const endpoint = 'http://localhost:3002/tasks';

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('tasksboard', { task: data, currentPage: 'tasksboard' });
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
      });
  } else {
    res.redirect('/login');
  }
};

exports.getTaskTable = (req, res) => {
  const { isloggedin } = req.session;

  if (isloggedin) {
    const endpoint = 'http://localhost:3002/tasks';

    axios
      .get(endpoint)
      .then((response) => {
        const data = response.data.result;
        res.render('taskstable', { task: data, currentPage: 'taskstable' });
      })
      .catch((error) => {
        console.log(`Error naking API request: ${error}`);
      });
  } else {
    res.redirect('/login');
  }
};

exports.addTask = (req, res) => {
  const { isloggedin, user_id } = req.session;
  const { title, description, duedate, category, priority } = req.body;
  const vals = { title, description, duedate, category, priority, user_id };

  if (isloggedin) {
    const endpoint = 'http://localhost:3002/tasks/new';

    axios
      .post(endpoint, vals)
      .then((response) => {
        const data = response.data;
        console.log(data);
        res.redirect('/taskboard');
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
      });
  }
};

exports.getTask = (req, res) => {
  const taskId = req.params.id;

  const endpoint = `http://localhost:3002/tasks/${taskId}`;

  axios
    .get(endpoint)
    .then((response) => {
      const data = response.data.result;
      res.json(data);
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
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
      console.log(response.data);
      res.redirect(redirectPage);
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
    });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;

  const endpoint = `http:/localhost:3002/tasks/${taskId}`;

  // Get the source page from the query parameter, default to '/taskboard' if not provided
  const redirectPage = req.query.source || '/taskboard';
  console.log(redirectPage);

  axios
    .delete(endpoint)
    .then((response) => {
      console.log(response.data);
      res.redirect(redirectPage);
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
    });
};

exports.completeTask = (req, res) => {
  const taskId = req.params.id;

  const endpoint = `http://localhost:3002/tasks/complete/${taskId}`;

  axios
    .patch(endpoint)
    .then((response) => {
      console.log(response.data);
      res.redirect('/taskboard');
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
    });
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = (req, res) => {
  const vals = ({ email, password } = req.body);

  const endpoint = `http://localhost:3002/user/login`;

  axios
    .post(endpoint, vals)
    .then((response) => {
      const data = response.data.result;
      console.log(data);
      const session = req.session;

      session.isloggedin = true;
      session.user_id = data[0].user_id;
      console.log(session);

      res.redirect('/');
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
    });
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

exports.getRegister = (req, res) => {
  res.render('register', { unmatched: false });
};

exports.postRegister = (req, res) => {
  const vals = ({ email, username, firstpassword, secondpassword } = req.body);
  console.log(vals);

  const endpoint = `http://localhost:3002/user`;

  // Check both passwords match - send an unmatched boolean if false
  if (firstpassword === secondpassword) {
    axios
      .post(endpoint, vals)
      .then((response) => {
        const data = response.data;
        console.log(data);
        res.redirect('/login');
      })
      .catch((error) => {
        console.log(`Error making API request: ${error}`);
      });
  } else {
    res.render('register', { unmatched: true });
  }
};

exports.get404 = (req, res) => {
  res.status(404);
  res.send('<h1>Page not found!</h1>');
};
