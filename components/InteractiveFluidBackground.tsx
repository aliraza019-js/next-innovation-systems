"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { useEffect, useState } from "react"

export default function InteractiveFluidBackground() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      style={{ contain: "strict", backgroundColor: "black" }}
    >
      <Shader className="h-full w-full">
        <Swirl
          colorA="#006a54"
          colorB="#00382d"
          speed={0.8}
          detail={0.8}
          blend={50}
          coarseX={40}
          coarseY={40}
          mediumX={40}
          mediumY={40}
          fineX={40}
          fineY={40}
        />
        
        <ChromaFlow
          baseColor="#032B25"
          upColor="#00ff88"
          downColor="#001a14"
          leftColor="#00ff88"
          rightColor="#00ff88"
          intensity={0.9}
          radius={1.8}
          momentum={25}
          maskType="alpha"
          opacity={0.95}
        />
      </Shader>
     
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  )
}
