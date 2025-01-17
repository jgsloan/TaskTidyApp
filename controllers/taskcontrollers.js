const conn = require('./../utils/dbconn');

exports.getHome = (req, res) => {
  res.status(200);
  const selectSQL = 'SELECT * FROM task';
  conn.query(selectSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      console.log(rows);
      res.render('dashboard');
    }
  });
};

exports.getTaskBoard = (req, res) => {
  res.status(200);
  const selectSQL = `SELECT * FROM task 
                        INNER JOIN priority ON task.priority_id=priority.priority_id 
                        INNER JOIN category ON task.category_id=category.category_id 
                        INNER JOIN status ON task.status_id=status.status_id;`;
  conn.query(selectSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.render('tasksboard', { task: rows });
    }
  });
};

exports.getTaskTable = (req, res) => {
  res.status(404);
  res.send('<h1>Page not ready yet!</h1>');
};

exports.addTask = (req, res) => {
  const task_creation_date = new Date().toISOString().slice(0, 10);
  const user_id = 1;
  const { title, description, duedate, category, priority } = req.body;
  const task_due_date = new Date(duedate).toISOString().slice(0, 10);
  const vals = [
    title,
    description,
    task_creation_date,
    task_due_date,
    category,
    priority,
    user_id,
  ];

  const insertSQL = `INSERT INTO task (task_name, task_description, task_creation_date, 
                        task_due_date, category_id, priority_id, user_id) 
                        VALUES (?,?,?,?,?,?,?)`;

  conn.query(insertSQL, vals, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/taskboard');
    }
  });
};

exports.getTask = (req, res) => {
  const taskId = req.params.id;
  console.log(taskId);

  try {
    const taskQuery = `SELECT * FROM task WHERE task_id = ?`;

    conn.query(taskQuery, [taskId], (err, rows) => {
      if (rows.length > 0) {
        console.log('Task Found:', rows[0]); // Log the the first task found
        res.json(rows[0]); // Send the first row (task) as JSON
      } else {
        res.status(404).json({ error: 'Task not found!' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server errror' });
  }
};

exports.completeTask = (req, res) => {
  res.status(404);
  res.send('<h1>Cannot complete a task yet!</h1>');
};

exports.get404 = (req, res) => {
  res.status(404);
  res.send('<h1>Page not found!</h1>');
};

exports.editTask = (req, res) => {
  const task_id = req.params.id;
  const { title, description, duedate, category, priority, status } = req.body;
  const task_due_date = new Date(duedate).toISOString().slice(0, 10);
  const vals = [title, description, task_due_date, category, priority, status, task_id];

  const updateSQL = `UPDATE task SET task_name = ?, task_description = ?, task_due_date = ?, category_id =?, priority_id =?, status_id = ? 
                      WHERE task_id = ? `;

  conn.query(updateSQL, vals, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/taskboard');
    }
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

  const session = req.session;
  session.isloggedin = true;
  console.log(session);
};
