// CHART 1 - DOUGHNUT FOR TAKS BY STATUS

// labels for doughnut chart
const xlabels1 = ['Not Started', 'In Progress', 'Completed', 'Cancelled'];

const chartdata1 = {
  labels: xlabels1,
  datasets: [
    {
      data: counts,
      hoverOffset: 10,
      spacing: 2,
    },
  ],
};

// Chart.js config
const chartconfig1 = {
  type: 'doughnut',
  data: chartdata1,
  events: ['click'],
  options: {
    rotation: 0,
    animation: { animateRotate: true, animateScale: true },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: 'Current Tasks',
        font: { size: 20 },
      },
    },
  },
};

const chart1 = new Chart('bkgcanvas1', chartconfig1);

// CHART 2 - LINE GRAPH FOR COMPLETED TASK FROM LAST 7 DAYS

// function to get the date suffix (st, nd, rd, th)
const getDateSuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

// Month names for formatting
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Function to get the last 7 days dynamically
const getLast7Days = () => {
  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i); // Subtract days from today

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const formattedDate = `${day}${getDateSuffix(day)} ${month}`;

    dates.push(formattedDate);
  }
  return dates;
};

const xlabels2 = getLast7Days(); // Generate lables for the last 7 days
const completedTasksPerDay = Array(7).fill(0); // Initialise array with 0's

// Loop through newData2 toi match completion data with the correct date
newData2.forEach(({ date, completed_tasks }) => {
  const completedDate = new Date(date); // Convert from ISO to Date object
  const formattedDate = `${completedDate.getDate()}${getDateSuffix(
    completedDate.getDate()
  )} ${monthNames[completedDate.getMonth()]}`;

  const index = xlabels2.indexOf(formattedDate); // Find the matching date
  if (index !== -1) {
    completedTasksPerDay[index] = completed_tasks;
  }
});

// Chart.js config
const chartdata2 = {
  labels: xlabels2,
  datasets: [
    {
      data: completedTasksPerDay,
      lineTension: 0,
      pointRadius: 3,
      backgroundColor: 'lightgray',
      borderColor: 'blue',
      borderWidth: 1,
    },
  ],
};

const chartconfig2 = {
  type: 'line',
  data: chartdata2,
  options: {
    responsive: true,
    animation: true,
    maintainAspectRatio: false,
    scales: { y: { min: 0, max: 6 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: { display: true, text: 'Completed Tasks Last 7 Days', font: { size: 20 } },
    },
  },
};

const chart2 = new Chart('bkgcanvas2', chartconfig2);
