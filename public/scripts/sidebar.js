// Client side javascript file for edit task functionality

// Wait for page to load
document.addEventListener('DOMContentLoaded', () => {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  console.log(sidebarLinks);

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      console.log('Link clicked!', link.textContent);
      // Remove the active-sidebar class from all links
      sidebarLinks.forEach((navLink) => navLink.classList.remove('active-sidebar'));

      // Add the active sidebar-sidebar class to the clicked link
      link.classList.add('active-sidebar');
    });
  });
});
