document.addEventListener('DOMContentLoaded', () = {
   Sidebar Toggle functionality
  const sidebarToggleBtn = document.getElementById('toggle-sidebar');
  const body = document.body;

  sidebarToggleBtn.addEventListener('click', () = {
    body.classList.toggle('sidebar-collapsed');
  });

   Theme Switcher functionality
  const themeToggleBtn = document.getElementById('toggle-theme');

  themeToggleBtn.addEventListener('click', () = {
    if (body.classList.contains('dark')) {
      body.classList.remove('dark');
      body.classList.add('light');
    } else {
      body.classList.remove('light');
      body.classList.add('dark');
    }
  });

   --- Initialize Charts ---
   Chart.js for visualizations
  
   Revenue Chart
  const revenueCtx = document.getElementById('revenue-chart').getContext('2d');
  new Chart(revenueCtx, {
    type 'line',
    data {
      labels ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets [
        {
          label 'Revenue',
          data [12000, 19000, 30000, 25000, 35000, 42000],
          borderColor '#fc820f',
          backgroundColor 'rgba(252, 130, 15, 0.2)',
          borderWidth 2,
          fill true,
          tension 0.4,
        },
      ],
    },
    options {
      responsive true,
      maintainAspectRatio false,
      scales {
        y {
          beginAtZero true,
        },
      },
    },
  });

   User Growth Chart
  const growthCtx = document.getElementById('growth-chart').getContext('2d');
  new Chart(growthCtx, {
    type 'bar',
    data {
      labels ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets [
        {
          label 'New Users',
          data [1500, 2200, 3100, 4500],
          backgroundColor '#fcfc0f',
        },
      ],
    },
    options {
      responsive true,
      maintainAspectRatio false,
      scales {
        y {
          beginAtZero true,
        },
      },
    },
  });
});