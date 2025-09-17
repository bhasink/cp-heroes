export const initializeScripts = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', function() {
      const header = document.querySelector('.site-header.topmain');
      if (window.scrollY > 100) {
        header?.classList.add('navfixed');
        header?.classList.remove('norm');
      } else {
        header?.classList.remove('navfixed');
        header?.classList.add('norm');
      }
    });
  }
};