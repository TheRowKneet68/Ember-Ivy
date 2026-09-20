;(function () {
  try {
    var t = localStorage.getItem('ei-theme')
    if (t === 'light') document.documentElement.classList.add('light')
  } catch (e) {}
})()