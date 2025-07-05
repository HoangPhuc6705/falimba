let keydown: string | null;
window.addEventListener('keydown', (event: KeyboardEvent) => {
  keydown = event.key;
})

window.addEventListener('keyup', () => {
  keydown = null
})

export { keydown }