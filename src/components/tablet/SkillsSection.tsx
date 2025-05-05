// src/components/tablet/SkillsSection.tsx
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
      className={`${satoshi.variable} min-h-screen bg-[#0c0c0c] relative flex items-center snap-start px-6`}
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
      <div className="relative z-10 w-full">
        {/* Title - Added top margin to prevent navbar overlap */}
        <h1 className="text-white text-4xl font-bold text-center mb-10 mt-24">MY TECH STACK</h1>

        {/* Cards Grid - Simplified for tablet */}
        <div className="space-y-6">
          {/* Top Row - 2 Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Database Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden p-4">
              <h3 className="text-white text-lg font-medium text-center mb-4">
                DATABASES
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <Image src={postgresqlIcon} alt="PostgreSQL" width={40} height={40} />
                  <span className="text-white text-xs mt-2">POSTGRESQL</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={xmlIcon} alt="XML" width={40} height={40} />
                  <span className="text-white text-xs mt-2">XML</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={mysqlIcon} alt="MySQL" width={40} height={40} />
                  <span className="text-white text-xs mt-2">MYSQL</span>
                </div>
              </div>
            </div>

            {/* Programming Languages Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white text-lg font-medium text-center mb-4">
                PROGRAMMING LANGUAGES
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <Image src={javaIcon} alt="Java" width={40} height={40} />
                  <span className="text-white text-xs mt-2">JAVA</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={javascriptIcon} alt="JavaScript" width={40} height={40} />
                  <span className="text-white text-xs mt-2">JAVASCRIPT</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={pythonIcon} alt="Python" width={40} height={40} />
                  <span className="text-white text-xs mt-2">PYTHON</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 gap-4">
            {/* Web Dev Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white text-lg font-medium text-center mb-4">
                WEB DEV
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <Image src={djangoIcon} alt="Django" width={40} height={40} />
                  <span className="text-white text-xs mt-2">DJANGO</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={htmlIcon} alt="HTML" width={40} height={40} />
                  <span className="text-white text-xs mt-2">HTML</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={cssIcon} alt="CSS" width={40} height={40} />
                  <span className="text-white text-xs mt-2">CSS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - 2 Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Other Tools Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white text-lg font-medium text-center mb-4">
                OTHER TOOLS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <Image src={notionIcon} alt="Notion" width={40} height={40} />
                  <span className="text-white text-xs mt-2">NOTION</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={figmaIcon} alt="Figma" width={40} height={40} />
                  <span className="text-white text-xs mt-2">FIGMA</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={aftereffectsIcon} alt="After Effects" width={40} height={40} />
                  <span className="text-white text-xs mt-2">AFTEREFFECTS</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={blenderIcon} alt="Blender" width={40} height={40} />
                  <span className="text-white text-xs mt-2">BLENDER</span>
                </div>
              </div>
            </div>

            {/* AI/ML Card */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white text-lg font-medium text-center mb-4">
                AI/ML
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <Image src={prologIcon} alt="Prolog" width={40} height={40} />
                  <span className="text-white text-xs mt-2">PROLOG</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={numpyIcon} alt="NumPy" width={40} height={40} />
                  <span className="text-white text-xs mt-2">NUMPY</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={scikitIcon} alt="Scikit" width={40} height={40} />
                  <span className="text-white text-xs mt-2">SCIKIT</span>
                </div>
                <div className="flex flex-col items-center">
                  <Image src={pandasIcon} alt="Pandas" width={40} height={40} />
                  <span className="text-white text-xs mt-2">PANDAS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified decorative elements */}
      <div className="absolute top-4 right-4">
        <div className="grid grid-cols-4 gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="grid grid-cols-3 gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1 h-1 border border-white/30" />
          ))}
        </div>
      </div>
    </section>
  )
}