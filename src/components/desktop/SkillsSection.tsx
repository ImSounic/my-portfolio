
// src/components/skills/SkillsSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import skillsGridSvg from '@/assets/images/skills-grid.svg'

// Import all skill icons
import postgresqlIcon from '@/assets/icons/postgresql.svg'
import xmlIcon from '@/assets/icons/xml.svg'
import mysqlIcon from '@/assets/icons/mysql.svg'
import javaIcon from '@/assets/icons/java.svg'
import javascriptIcon from '@/assets/icons/javascript.svg'
import pythonIcon from '@/assets/icons/python.svg'
import djangoIcon from '@/assets/icons/django.svg'
import htmlIcon from '@/assets/icons/html.svg'
import cssIcon from '@/assets/icons/css.svg'
import notionIcon from '@/assets/icons/notion.svg'
import figmaIcon from '@/assets/icons/figma.svg'
import aftereffectsIcon from '@/assets/icons/aftereffects.svg'
import blenderIcon from '@/assets/icons/blender.svg'
import prologIcon from '@/assets/icons/prolog.svg'
import numpyIcon from '@/assets/icons/numpy.svg'
import scikitIcon from '@/assets/icons/scikit.svg'
import pandasIcon from '@/assets/icons/pandas.svg'

const satoshi = localFont({
  src: [
    {
      path: '../../../public/fonts/Satoshi-Black.otf',
      weight: '900',
      style: 'normal'
    },
  ],
  variable: '--font-satoshi',
})

export default function SkillsSection() {
  return (
    <section 
      id="skills"
      className={`${satoshi.variable} min-h-screen bg-black relative flex items-center snap-start`}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={skillsGridSvg}
          alt="Background grid"
          fill
          className="object-cover opacity-40"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-8">
        {/* Title - Added top margin to prevent navbar overlap */}
        <h1 className="text-white text-6xl font-bold text-center mb-12 mt-24">MY TECH STACK</h1>

        {/* Cards Grid - Full width */}
        <div className="space-y-8">
          {/* Top Row - 3 Cards */}
          <div className="grid grid-cols-3 gap-8">
            {/* Database Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden min-h-[300px]">
              <div className="flex h-full">
                <div className="flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  <h3 className="text-white text-xl font-medium tracking-wider px-4">
                    DATABASES
                  </h3>
                </div>
                <div className="flex-1 p-20">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <Image src={postgresqlIcon} alt="PostgreSQL" width={50} height={50} />
                      <span className="text-white mt-2">POSTGRESQL</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src={xmlIcon} alt="XML" width={50} height={50} />
                      <span className="text-400 mt-2">XML</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                      <Image src={mysqlIcon} alt="MySQL" width={50} height={50} />
                      <span className="text-white mt-2">MYSQL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Programming Languages Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[300px]">
              <h2 className="text-white text-xl font-medium text-center mb-20">PROGRAMMING LANGUAGES</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <Image src={javaIcon} alt="Java" width={50} height={50} />
                  <span className="text-white mt-2">JAVA</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={javascriptIcon} alt="JavaScript" width={50} height={50} />
                  <span className="text-white mt-2">JAVASCRIPT</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={pythonIcon} alt="Python" width={50} height={50} />
                  <span className="text-white mt-2">PYTHON</span>
                </div>
              </div>
            </div>

            {/* Web Dev Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden min-h-[300px]">
              <div className="flex h-full">
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col items-center">
                      <Image src={djangoIcon} alt="Django" width={50} height={50} />
                      <span className="text-white mt-2">DJANGO</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src={htmlIcon} alt="HTML" width={50} height={50} />
                      <span className="text-white mt-2">HTML</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src={cssIcon} alt="CSS" width={50} height={50} />
                      <span className="text-white mt-2">CSS</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
                  <h3 className="text-white text-xl font-medium tracking-wider px-4">
                    WEB DEV
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - 2 Cards */}
          <div className="grid grid-cols-2 gap-8">
            {/* Other Tools Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white text-xl font-medium mb-6 text-center">OTHER TOOLS</h3>
              
              <div className="space-y-4">
                {/* First row - offset to right */}
                <div className="flex justify-center">
                  <div className="flex gap-48 ml-48">
                    <div className="flex flex-col items-center">
                      <Image src={notionIcon} alt="Notion" width={50} height={50} />
                      <span className="text-white mt-2">NOTION</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src={figmaIcon} alt="Figma" width={50} height={50} />
                      <span className="text-white mt-2">FIGMA</span>
                    </div>
                  </div>
                </div>
                
                {/* Second row - normal position */}
                <div className="flex justify-center">
                  <div className="flex gap-48 ml-[-100px]">
                    <div className="flex flex-col items-center">
                      <Image src={aftereffectsIcon} alt="After Effects" width={50} height={50} />
                      <span className="text-white mt-2">AFTEREFFECTS</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Image src={blenderIcon} alt="Blender" width={50} height={50} />
                      <span className="text-white mt-2">BLENDER</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI/ML Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white text-xl font-medium mb-12 text-center">AI/ML</h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <Image src={prologIcon} alt="Prolog" width={50} height={50} />
                  <span className="text-white mt-2">PROLOG</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={numpyIcon} alt="NumPy" width={50} height={50} />
                  <span className="text-white mt-2">NUMPY</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={scikitIcon} alt="Scikit" width={50} height={50} />
                  <span className="text-white mt-2">SCIKIT</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={pandasIcon} alt="Pandas" width={50} height={50} />
                  <span className="text-white mt-2">PANDAS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-8 right-8">
        <div className="grid grid-cols-4 gap-1">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 right-8">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 border border-white/30" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-8">
        <div className="w-12 h-12 border-4 border-white/30 transform rotate-45" />
      </div>
    </section>
  )
}