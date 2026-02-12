import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Barcode from './Barcode'

const TerminalLoader = ({ onComplete }) => {
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [displayedText, setDisplayedText] = useState([])
  
  const systemInfo = [
    { label: 'NAME', value: 'Vaidyanond' },
    { label: 'ROLE', value: 'Developer' },
    { label: 'FIELD', value: 'Interactive / Web / Creative' }
  ]
  
  const phases = [
    'Loading environment...',
    'Initializing graphics engine...',
    'Optimizing render pipeline...',
    'Loading assets...',
    'Ready to launch...'
  ]

  // Typing animation effect
  useEffect(() => {
    const text = `System initialization started...
Boot sequence initiated...
Loading core modules...
Mounting file systems...
Establishing secure connection...
Loading user profile...
Initializing display adapter...
Loading animation frameworks...`
    
    const lines = text.split('\n')
    let currentLine = 0
    
    const typeInterval = setInterval(() => {
      if (currentLine < lines.length) {
        setDisplayedText(prev => [...prev, lines[currentLine]])
        currentLine++
      } else {
        clearInterval(typeInterval)
      }
    }, 100)
    
    return () => clearInterval(typeInterval)
  }, [])

  // Progress animation - 3.5 seconds total
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 800)
          return 100
        }
        
        const newPhase = Math.min(Math.floor((prev / 100) * phases.length), phases.length - 1)
        setLoadingPhase(newPhase)
        
        // Adjusted for 3.5 second total duration (3500ms / 30ms = ~117 steps, 100/117 = 0.86)
        return prev + 0.86
      })
    }, 30)
    
    return () => clearInterval(interval)
  }, [onComplete, phases.length])

  const progressBar = Array(30).fill(0).map((_, i) => 
    i < (progress / 100) * 30 ? '█' : '░'
  ).join('')

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center font-mono text-sm"
      style={{ backgroundColor: 'var(--color-neutral-50)' }}
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
    >
      <div className="w-full max-w-2xl p-8">
        {/* Terminal container */}
        <div 
          className="rounded-lg overflow-hidden backdrop-blur-sm"
          style={{ 
            backgroundColor: 'var(--color-neutral-50)',
            borderColor: 'var(--color-dusk)',
            borderWidth: '1px'
          }}
        >
          {/* Terminal header */}
          <div 
            className="px-4 py-2 flex items-center gap-2"
            style={{ 
              backgroundColor: 'var(--color-neutral-100)',
              borderBottom: '1px solid var(--color-dusk)'
            }}
          >
            <div className="flex gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: 'var(--color-coral)' }}
              ></div>
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: 'var(--color-dusk)' }}
              ></div>
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: 'var(--color-lagoon)' }}
              ></div>
            </div>
            <span 
              className="ml-4 text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              system_boot.exe
            </span>
          </div>
          
          {/* Terminal content */}
          <div className="p-6 space-y-4" style={{ color: 'var(--color-text-primary)' }}>
            {/* ASCII Art - Solid Computerized Style */}
            <div style={{ color: 'var(--color-ok-400)' }} className="mb-6">
              <pre className="text-[10px] leading-none font-mono whitespace-pre">
{`
██╗   ██╗ ██████╗ ██╗   ██╗██████╗  █████╗ ██╗      ██████╗ ███╗   ███╗███████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔═══██╗████╗ ████║██╔════╝
 ╚████╔╝ ██║   ██║██║   ██║██████╔╝███████║██║     ██║   ██║██╔████╔██║█████╗  
  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗██╔══██║██║     ██║   ██║██║╚██╔╝██║██╔══╝  
   ██║   ╚██████╔╝╚██████╔╝██████╔╝██║  ██║███████╗╚██████╔╝██║ ╚═╝ ██║███████╗
   ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
`}</pre>
            </div>
            
            {/* System info */}
            <div className="space-y-1 mb-6">
              {systemInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <span style={{ color: 'var(--color-lagoon)' }} className="w-12">
                    {item.label}
                  </span>
                  <span style={{ color: 'var(--color-dusk)' }}>:</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
            
            {/* Typing log */}
            <div 
              className="h-32 overflow-hidden text-xs mb-4 font-mono leading-relaxed"
              style={{ color: 'var(--color-neutral-500)' }}
            >
              {displayedText.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  <span style={{ color: 'var(--color-lagoon)' }}>$</span> {line}
                </motion.div>
              ))}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 align-middle ml-1"
                style={{ backgroundColor: 'var(--color-lagoon)' }}
              />
            </div>
            
            {/* Loading phases */}
            <div className="space-y-2 mb-4">
              {phases.slice(0, loadingPhase + 1).map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-xs"
                >
                  <span style={{ color: 'var(--color-ok-400)' }}>✓</span>
                  <span 
                    style={{ 
                      color: i === loadingPhase ? 'var(--color-lagoon)' : 'var(--color-neutral-500)'
                    }}
                  >
                    {phase}
                  </span>
                </motion.div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs" style={{ color: 'var(--color-neutral-500)' }}>
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div 
                className="font-mono text-xs tracking-wider"
                style={{ color: 'var(--color-ok-400)' }}
              >
                [{progressBar}]
              </div>
            </div>
          </div>
        </div>
        
        {/* Barcode decoration */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Barcode 
            value="SYSTEM-INIT" 
            className="w-48" 
            lineColor="var(--color-dusk)"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TerminalLoader
