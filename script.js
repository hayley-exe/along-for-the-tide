const menuIcon = document.getElementById('menuIcon');
const sidebar = document.getElementById('sidebar');

if (menuIcon && sidebar) {
    menuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuIcon.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
    });

    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuIcon.textContent = '☰';
        });
    });
}
