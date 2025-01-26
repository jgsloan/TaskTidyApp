const conn = require('./../utils/dbconn');
const axios = require('axios');

exports.getHome = (req, res) => {
  const { isloggedin } = req.session;

  if (isloggedin) {
    res.status(200);
    const selectSQL = 'SELECT * FROM task';
    conn.query(selectSQL, (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.render('dashboard', { currentPage: 'dashboard' });
      }
    });
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

  axios
    .patch(endpoint, vals)
    .then((response) => {
      console.log(response.data);
      res.redirect('/taskboard');
    })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
    });
};

exports.deleteTask = (req, res) => {
  console.log(`Clicked Delete!`);

  const task_id = req.params.id;
  console.log(task_id);

  const deleteSQL = `DELETE FROM task WHERE task_id = ${task_id}`;
  conn.query(deleteSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/taskboard');
    }
  });
};

exports.completeTask = (req, res) => {
  const task_id = req.params.id;

  const completeSQL = `UPDATE task SET status_id = 3 WHERE task_id = ${task_id}`;
  conn.query(completeSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/taskboard');
    }
  });
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const vals = [email, password];
  console.log(`login values are: ${vals}`);

  const checkUserSQL = `SELECT * FROM user WHERE user_email_address = ? AND user_password = ?;`;

  conn.query(checkUserSQL, vals, (err, rows) => {
    if (err) throw err;

    const numrows = rows.length;
    console.log(numrows);
    if (numrows > 0) {
      console.log(rows);
      const session = req.session;
      session.isloggedin = true;
      session.user_id = rows[0].user_id;
      console.log(session);
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
};

exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = (req, res) => {
  const { email, username, firstpassword, secondpassword } = req.body;
  console.log(req.body);
  const vals = [email, username, firstpassword];

  if (firstpassword == secondpassword) {
    const addUserSQL = `INSERT INTO user (user_email_address, username, user_password) 
                        VALUES (?, ?, ?); `;

    conn.query(addUserSQL, vals, (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.redirect('/login');
      }
    });
  } else {
    res.redirect('/register');
  }
};

exports.get404 = (req, res) => {
  res.status(404);
  res.send('<h1>Page not found!</h1>');
};
