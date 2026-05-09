"use client"
import React from "react"
import { motion } from "framer-motion"


interface Testimonial {
  text: string
  name: string
  role: string
  image?: string 
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => {
  return (
    <div className={`relative overflow-hidden h-[700px] ${props.className}`}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
          
              {props.testimonials.map(({ text, name, role, image }, i) => (
                <div
                  className="p-10 rounded-3xl border border-white/20 shadow-lg bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/15%),theme(backgroundColor.white/5%))] backdrop-blur-sm max-w-xs w-full"
                  style={{
                    boxShadow:
                      "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(156, 163, 175, 0.1), 0 0 20px rgba(156, 163, 175, 0.05)",
                  }}
                  key={i}
                >
                  <div className="text-gray-200 text-sm leading-relaxed">{text}</div>
                  
            
                  <div className="mt-5 flex items-center gap-3">
                    {image && (
                      <img 
                        src={image} 
                        alt={name} 
                        className="h-10 w-10 rounded-full border border-white/20 object-cover shrink-0" 
                      />
                    )}
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-gray-100">{name}</div>
                      <div className="text-xs leading-5 opacity-60 tracking-tight text-gray-300">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}