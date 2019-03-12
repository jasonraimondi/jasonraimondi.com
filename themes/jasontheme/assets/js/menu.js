let isSidebarOpen = false;

// // Toggle button
document.querySelector('.toggle-button').addEventListener('click', function () {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
    isSidebarOpen = !isSidebarOpen;
});

function openSidebar() {
    var element = document.querySelector('html');
    element.classList.add('sidebar-is-open');
}


function closeSidebar() {
    var element = document.querySelector('html');
    element.classList.remove('sidebar-is-open');
}
