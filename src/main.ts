// Same origin as the apps, so we can clear their storage directly.
document.getElementById('reset')?.addEventListener('click', () => {
  if (!window.confirm('Delete all club data (reservations, lessons, users)? Apps will reseed the demo data.')) return
  localStorage.removeItem('club:v1')
  Object.keys(sessionStorage)
    .filter((key) => key.startsWith('club:'))
    .forEach((key) => sessionStorage.removeItem(key))
  const message = document.getElementById('reset-message')
  if (message) message.textContent = 'Data reset. The demo data will be recreated the next time an app opens.'
})
