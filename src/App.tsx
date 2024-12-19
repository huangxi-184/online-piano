import { useEffect, useMemo } from "react"
import "./App.css"

interface KeyData {
  frequency: number
}

function App() {
  const keys: Record<string, KeyData> = {
    A: {
      frequency: 196,
    },
    S: {
      frequency: 220,
    },
    D: {
      frequency: 246,
    },
    F: {
      frequency: 261,
    },
    G: {
      frequency: 293,
    },
    H: {
      frequency: 329,
    },
    J: {
      frequency: 349,
    },
    K: {
      frequency: 392,
    },
  }

  const context = useMemo(() => {
    return new AudioContext()
  }, [])

  const play = (key: string) => {
    const frequency = keys[key]?.frequency
    if (!frequency) {
      return
    }

    const osc = context.createOscillator()
    const gain = context.createGain()

    osc.type = "sine"
    osc.frequency.value = frequency

    osc.connect(gain)
    gain.connect(context.destination)

    gain.gain.setValueAtTime(0, context.currentTime)
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01)

    osc.start(context.currentTime)

    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1)
    osc.stop(context.currentTime + 1)

    const keyElement = document.getElementById(`key-${key}`)
    if (keyElement) {
      keyElement.classList.add("pressed")
      setTimeout(() => keyElement.classList.remove("pressed"), 100)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      play(e.key.toUpperCase())
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <section className="keys-style">
      {Object.keys(keys).map((item) => (
        <div id={`key-${item}`} className="key-style" key={item} onClick={() => play(item)}>
          <span>{item}</span>
        </div>
      ))}
    </section>
  )
}

export default App
