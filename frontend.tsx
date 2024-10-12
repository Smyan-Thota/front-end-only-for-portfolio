import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

// Custom font declaration
const bhankFont = {
  fontFamily: 'Bhank',
  fontWeight: 'normal',
  fontStyle: 'normal',
  src: `
    url('/fonts/Bhank.woff2') format('woff2'),
    url('/fonts/Bhank.woff') format('woff')
  `
}

function AnimatedSubtitle() {
  const words = [""]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.h2
      key={words[index]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-semibold text-gray-300 mt-4"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {words[index]}
    </motion.h2>
  )
}

function EvolvingWeb() {
  const points = useRef(null)
  const particlesCount = 500
  const positions = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x += delta * 0.1
      points.current.rotation.y += delta * 0.1
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8b0000" sizeAttenuation={true} />
    </points>
  )
}

function FloatingSkills() {
  const skills = []
  const group = useRef()

  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <group ref={group}>
      {skills.map((skill, index) => (
        <Text
          key={skill}
          position={[
            Math.sin(index / skills.length * Math.PI * 2) * 5,
            (Math.random() - 0.5) * 2,
            Math.cos(index / skills.length * Math.PI * 2) * 5
          ]}
          fontSize={0.5}
          color="#8b0000"
          anchorX="center"
          anchorY="middle"
        >
          {skill}
        </Text>
      ))}
    </group>
  )
}

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg shadow-lg bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <img src={project.image} alt={project.title} className="w-full h-80 object-cover opacity-70" />
      <motion.div
        className="absolute inset-0 bg-gray-900 bg-opacity-70 flex flex-col justify-center items-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{project.title}</h3>
        <p className="text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span key={index} className="bg-red-900 bg-opacity-50 text-white text-xs px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
              GitHub
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function SkillBar({ skill, level }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-white">{skill}</span>
        <span className="text-sm font-medium text-white">{level}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className="bg-red-800 h-2.5 rounded-full" style={{ width: `${level}%` }}></div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const projects = [
    {
      id: 1,
      title: "End to End Sales and Inventory ERP Product",
      description: "Led the development of a comprehensive ERP platform for BikoWo, an electric bike company. Integrated various business processes, implemented PowerBI reports, and managed stock and logistics. Raised $100K and generated $370K in revenue.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["ERP", "PowerBI", "Business Intelligence"],
      demoUrl: "https://example.com/bikowo-erp",
      githubUrl: "https://github.com/smyanthota/bikowo-erp"
    },
    {
      id: 2,
      title: "Gamified Calendar",
      description: "Developed a responsive multi-page front-end UI with graphical representations using React JS. Established connectivity between the front-end and the database as part of a 5-member team.",
      image: "/placeholder.svg?height=600&width=800",
      tags: ["React", "UI/UX", "Database Integration"],
      demoUrl: "https://example.com/gamified-calendar",
      githubUrl: "https://github.com/smyanthota/gamified-calendar"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
          overflow-x: hidden;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: #8b0000;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a50000;
        }
      `}</style>
      <div className="fixed inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} />
          <EvolvingWeb />
          <FloatingSkills />
        </Canvas>
      </div>
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Smyan Thota</h1>
          <nav>
            <ul className="flex space-x-6">
              {['home', 'about', 'education', 'experience', 'projects', 'skills', 'contact'].map((section) => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    className={`transition-colors text-lg ${
                      activeSection === section ? 'text-red-800' : 'text-white hover:text-red-800'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main>
          <section id="home" className="h-screen flex flex-col justify-center items-center relative">
            <div className="z-10 text-center">
              <motion.h1 
                className="text-7xl font-bold mb-4" 
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Smyan Thota
              </motion.h1>
              <AnimatePresence mode="wait">
                <AnimatedSubtitle />
              </AnimatePresence>
              <div className="mt-8 space-y-2">
                <p>smyanisworking@gmail.com</p>
                <p>Cleveland OH</p>
                <a href="https://www.linkedin.com/in/smyanthota" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">LinkedIn</a>
              </div>
            </div>
          </section>

          <section id="about" className="min-h-screen py-20 px-6 flex items-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>About Me</h2>
              <div className="space-y-6 text-lg">
                <p>
                  👋 Hey there! I'm Smyan, a Data Engineer with a twist. Think of me as a data chef, whipping up delicious insights from raw ingredients (aka data) in the kitchen of financial services.
                </p>
                <p>
                  🚀 My superpower? Turning messy data into streamlined pipelines faster than you can say "ETL". I've been known to make APIs dance, CRMs sing, and databases do backflips (figuratively, of course).
                </p>
                <p>
                  🏋️‍♂️ At my current gig, I'm the gym trainer for lazy data, getting it into shape with advanced workflows and automation. I've successfully connected more third-party apps than a social butterfly at a tech conference.
                </p>
                <p>
                  ☁️ Cloud is my playground, and I've mastered the art of data migration without losing a single byte. It's like playing Jenga with terabytes of data - thrilling, right?
                </p>
                <p>
                  🕵️‍♂️ In my past life as a Database Intern at Bartronics India Ltd, I was the Sherlock Holmes of stored procedures, solving the mystery of slow queries and making POS machines communicate faster than office gossip.
                </p>
                <p>
                  🤖 When I'm not wrangling data, you'll find me geeking out over Machine Learning models. My idea of a good time? Implementing low-latency ML solutions while sipping on a cup of perfectly brewed coffee.
                </p>
                <p>
                  💡 My mission? To prove that data isn't just numbers and charts - it's the secret sauce to making better decisions and building systems that make a real impact. Let's turn those bytes into insights that bite!
                </p>
              </div>
            </div>
          </section>

          <section id="education" className="min-h-screen py-20 px-6 flex items-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>Education</h2>
              <div className="bg-gray-900 rounded-lg p-6 mb-8 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-2">Case Western Reserve University</h3>
                <p className="text-xl mb-2">Bachelor's in Computer Science</p>
                <p className="mb-2">Graduation: May 2024</p>
                <p className="mb-2">Cumulative GPA: 3.7</p>
                <p className="mb-4">Awards: Dean's Honor List, University Scholarship Recipient</p>
                <h4 className="text-xl font-semibold mb-2">Relevant Coursework:</h4>
                <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li>Machine Learning</li>
                  <li>Artificial Intelligence</li>
                  <li>Computer Architecture</li>
                  <li>Algorithms</li>
                  <li>Data Structures</li>
                  <li>Full Stack Web Development</li>
                  <li>Data Science: Statistical Learning</li>
                  <li>Software Engineering</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="experience" className="min-h-screen py-20 px-6 flex items-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>Professional Experience</h2>
              <div className="space-y-12">
                <div className="bg-gray-900 rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-2">Data Engineer</h3>
                  <p className="text-xl mb-2">MAI Capital Management, Cleveland</p>
                  <p className="mb-4">2023 – Present</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Orchestrated ETL pipelines like a data symphony conductor</li>
                    <li>Crafted Python scripts that automate data tasks faster than you can say "efficiency"</li>
                    <li>Built SQL queries so complex, they make database admins weep tears of joy</li>
                    <li>Tamed wild datasets with pandas, turning data chaos into data zen</li>
                    <li>Implemented Fort Knox-level secure data transfers using Paramiko for SFTP</li>
                    <li>Played data matchmaker, ensuring different systems talk to each other without awkward silences</li>
                  </ul>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-2">Database Intern</h3>
                  <p className="text-xl mb-2">Bartronics India Limited, Hyderabad</p>
                  <p className="mb-4">2021 – 2023</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Performed database CPR, reviving slow queries and reducing execution times by 25%</li>
                    <li>Implemented indexing strategies so clever, they made search operations feel like teleportation</li>
                    <li>Deployed patches to 5000+ POS machines, turning them into a nationwide network of happy little computers</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="min-h-screen py-20 px-6">
            <h2 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section id="skills" className="min-h-screen py-20 px-6 flex items-center">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>Technical Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Programming Languages</h3>
                  <SkillBar skill="Java" level={90} />
                  <SkillBar skill="Python" level={95} />
                  <SkillBar skill="SQL" level={90} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Web Technologies</h3>
                  <SkillBar skill="HTML/CSS" level={85} />
                  <SkillBar skill="JavaScript" level={90} />
                  <SkillBar skill="React" level={85} />
                  <SkillBar skill="Angular" level={80} />
                  <SkillBar skill="Node.js" level={85} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Databases</h3>
                  <SkillBar skill="PostgreSQL" level={90} />
                  <SkillBar skill="Microsoft SQL Server" level={85} />
                  <SkillBar skill="MongoDB" level={80} />
                  <SkillBar skill="NoSQL" level={75} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Cloud & DevOps</h3>
                  <SkillBar skill="Azure" level={80} />
                  <SkillBar skill="AWS" level={75} />
                  <SkillBar skill="Docker" level={80} />
                  <SkillBar skill="Git" level={90} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Data Science & ML</h3>
                  <SkillBar skill="TensorFlow" level={85} />
                  <SkillBar skill="PyTorch" level={80} />
                  <SkillBar skill="Keras" level={85} />
                  <SkillBar skill="Scikit-learn" level={85} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Data Visualization</h3>
                  <SkillBar skill="Microsoft Power BI" level={90} />
                  <SkillBar skill="Tableau" level={85} />
                </div>
              </div>
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-4">Additional Skills</h3>
                <ul className="list-disc list-inside grid grid-cols-2 gap-2">
                  <li>Erwin Data Modelling</li>
                  <li>Agile & SCRUM</li>
                  <li>Paramiko</li>
                  <li>Data Engineering</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="contact" className="min-h-screen py-20 px-6 flex items-center">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>Get in Touch</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="w-full p-3 rounded-lg bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:border-red-800 focus:outline-none transition-all duration-300" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="w-full p-3 rounded-lg bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:border-red-800 focus:outline-none transition-all duration-300" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    className="w-full p-3 rounded-lg bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:border-red-800 focus:outline-none transition-all duration-300"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-red-800 bg-opacity-80 text-white py-3 rounded-lg hover:bg-opacity-100 transition-colors text-lg font-semibold" 
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer className="py-8 text-center bg-gray-900 bg-opacity-30 backdrop-filter backdrop-blur-lg">
          <p className="text-gray-400">&copy; 2024 Smyan Satyarthi Thota. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}                
