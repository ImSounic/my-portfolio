// src/components/mobile/SkillsSection.tsx
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
      className={`${satoshi.variable} min-h-screen bg-[#0c0c0c] relative flex flex-col items-center  px-4 py-16`}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={skillsGridSvg}
          alt="Background grid"
          fill
          className="object-cover opacity-30"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full pt-12">
        {/* Title */}
        <h1 className="text-white text-3xl font-bold text-center mb-8">MY TECH STACK</h1>

        {/* Cards - All stacked for mobile */}
        <div className="space-y-4">
          {/* Programming Languages Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-base font-medium text-center mb-3">
              PROGRAMMING LANGUAGES
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <Image src={javaIcon} alt="Java" width={32} height={32} />
                <span className="text-white text-xs mt-1">JAVA</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={javascriptIcon} alt="JavaScript" width={32} height={32} />
                <span className="text-white text-xs mt-1">JS</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={pythonIcon} alt="Python" width={32} height={32} />
                <span className="text-white text-xs mt-1">PYTHON</span>
              </div>
            </div>
          </div>

          {/* Web Dev Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-base font-medium text-center mb-3">
              WEB DEV
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <Image src={djangoIcon} alt="Django" width={32} height={32} />
                <span className="text-white text-xs mt-1">DJANGO</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={htmlIcon} alt="HTML" width={32} height={32} />
                <span className="text-white text-xs mt-1">HTML</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={cssIcon} alt="CSS" width={32} height={32} />
                <span className="text-white text-xs mt-1">CSS</span>
              </div>
            </div>
          </div>

          {/* Database Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-base font-medium text-center mb-3">
              DATABASES
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <Image src={postgresqlIcon} alt="PostgreSQL" width={32} height={32} />
                <span className="text-white text-xs mt-1">POSTGRESQL</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={xmlIcon} alt="XML" width={32} height={32} />
                <span className="text-white text-xs mt-1">XML</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={mysqlIcon} alt="MySQL" width={32} height={32} />
                <span className="text-white text-xs mt-1">MYSQL</span>
              </div>
            </div>
          </div>

          {/* AI/ML Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-base font-medium text-center mb-3">
              AI/ML
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center">
                <Image src={prologIcon} alt="Prolog" width={32} height={32} />
                <span className="text-white text-xs mt-1">PROLOG</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={numpyIcon} alt="NumPy" width={32} height={32} />
                <span className="text-white text-xs mt-1">NUMPY</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={scikitIcon} alt="Scikit" width={32} height={32} />
                <span className="text-white text-xs mt-1">SCIKIT</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={pandasIcon} alt="Pandas" width={32} height={32} />
                <span className="text-white text-xs mt-1">PANDAS</span>
              </div>
            </div>
          </div>

          {/* Other Tools Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white text-base font-medium text-center mb-3">
              OTHER TOOLS
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center">
                <Image src={notionIcon} alt="Notion" width={32} height={32} />
                <span className="text-white text-xs mt-1">NOTION</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={figmaIcon} alt="Figma" width={32} height={32} />
                <span className="text-white text-xs mt-1">FIGMA</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={aftereffectsIcon} alt="After Effects" width={32} height={32} />
                <span className="text-white text-xs mt-1">AE</span>
              </div>
              <div className="flex flex-col items-center">
                <Image src={blenderIcon} alt="Blender" width={32} height={32} />
                <span className="text-white text-xs mt-1">BLENDER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}