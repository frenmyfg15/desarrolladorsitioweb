'use client'
import React from 'react'
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaGithub,
  FaPython,
  FaJava,
  FaDocker,
  FaAws,
  FaLinux,
  FaChrome,
  FaLaptopCode,
  FaJsSquare,
  FaTerminal,
  FaDatabase,
  FaNpm,
  FaKeyboard,
  FaCogs,
  FaCode,
  FaBug,
} from 'react-icons/fa'


const outerIcons = [
  <FaReact size={50} color="#22FF00" />,
  <FaNodeJs size={50} color="white" />,
  <FaGitAlt size={50} color="black" />,
  <FaHtml5 size={50} color="#22FF00" />,
  <FaCss3Alt size={50} color="white" />,
  <FaGithub size={50} color="black" />,
  <FaPython size={50} color="#22FF00" />,
  <FaJava size={50} color="white" />,
  <FaDocker size={50} color="black" />,
  <FaAws size={50} color="#22FF00" />,
  <FaLinux size={50} color="white" />,
  <FaChrome size={50} color="black" />,
]


const innerIcons = [
  <FaLaptopCode size={30} color="white" />,
  <FaJsSquare size={30} color="#22FF00" />,
  <FaTerminal size={30} color="white" />,
  <FaDatabase size={30} color="black" />,
  <FaNpm size={30} color="#22FF00" />,
  <FaKeyboard size={30} color="white" />,
  <FaCogs size={30} color="black" />,
  <FaCode size={30} color="#22FF00" />,
  <FaBug size={30} color="white" />,
]


export default function IconOrbit() {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mx-auto">
      {/* Círculo externo */}
      <div className="absolute inset-0 animate-spin-slow flex items-center justify-center">
        <div className="relative w-full h-full">
          {outerIcons.map((icon, i) => {
            const angle = (2 * Math.PI * i) / outerIcons.length
            const radius = 45 // porcentaje
            const top = 50 - radius * Math.sin(angle)
            const left = 50 + radius * Math.cos(angle)
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {icon}
              </div>
            )
          })}
        </div>
      </div>

      {/* Círculo interno */}
      <div className="absolute inset-0 animate-spin-reverse-slower flex items-center justify-center">
        <div className="relative w-2/3 h-2/3">
          {innerIcons.map((icon, i) => {
            const angle = (2 * Math.PI * i) / innerIcons.length
            const radius = 40
            const top = 50 - radius * Math.sin(angle)
            const left = 50 + radius * Math.cos(angle)
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {icon}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
