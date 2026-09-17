import confetti from 'canvas-confetti'

function toOrigin(x, y) {
  return {
    x: x / window.innerWidth,
    y: y / window.innerHeight,
  }
}

export function useConfetti() {
  // Green tile: ~40-60 particles, spread ~120px radius, 800ms duration
  function greenBurst(x, y) {
    confetti({
      particleCount: 50,
      spread: 80,
      startVelocity: 38,
      gravity: 0.9,
      ticks: 190,
      scalar: 0.9,
      origin: toOrigin(x, y),
    })
  }

  // Yellow tile: ~15-25 particles, spread ~60px radius, 500ms duration
  function yellowBurst(x, y) {
    confetti({
      particleCount: 20,
      spread: 55,
      startVelocity: 22,
      gravity: 0.9,
      ticks: 120,
      scalar: 0.8,
      origin: toOrigin(x, y),
    })
  }

  // Full-screen confetti storm for ~2 seconds on win
  function winStorm() {
    const duration = 2000
    const end = Date.now() + duration
    ;(function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        startVelocity: 55,
        origin: { x: 0, y: 0.6 },
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        startVelocity: 55,
        origin: { x: 1, y: 0.6 },
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()

    confetti({
      particleCount: 120,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.3 },
    })
  }

  return { greenBurst, yellowBurst, winStorm }
}
