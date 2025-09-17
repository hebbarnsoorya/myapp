document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const leftNav = document.getElementById('left-nav');
    const navTexts = document.querySelectorAll('.nav-text');
    const logoName = document.querySelector('.logo-name');
    const menuToggle = document.getElementById('menu-toggle');

    // Toggle Left Navigation
    navToggle.addEventListener('click', () => {
        leftNav.classList.toggle('w-64');
        leftNav.classList.toggle('w-20');
        navTexts.forEach(el => el.classList.toggle('hidden'));
        logoName.classList.toggle('hidden');
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        leftNav.classList.toggle('w-64');
        leftNav.classList.toggle('w-0');
        navTexts.forEach(el => el.classList.toggle('hidden'));
        logoName.classList.toggle('hidden');
    });

    // Example Chart Rendering (using Chart.js)
    const salesChartCtx = document.getElementById('sales-chart').getContext('2d');
    const salesChart = new Chart(salesChartCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales ($)',
                data: [12000, 19000, 13000, 15000, 22000, 28000],
                borderColor: '#fc820f', // Primary Accent Color
                backgroundColor: 'rgba(252, 130, 15, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#444' },
                    ticks: { color: '#e0e0e0' }
                },
                x: {
                    grid: { color: '#444' },
                    ticks: { color: '#e0e0e0' }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // More charts can be initialized here
    // const engagementChartCtx = document.getElementById('engagement-chart').getContext('2d');
    // ...
});