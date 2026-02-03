// src/components/sections/ContactSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import contactGridSvg from '@/assets/images/contact-grid.svg'
import contactSvg from '@/assets/icons/contact.svg'
import linkedinSvg from '@/assets/icons/linkedin.svg'
import mailSvg from '@/assets/icons/mail.svg'
import arrowSvg from '@/assets/icons/arrow.svg'
import CircleFillOverlay from '@/components/ui/CircleFillOverlay'
import handSvg from '@/assets/icons/hand.svg'

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

export default function ContactSection() {
  return (
    <section 
      id="contact"
      className={`${satoshi.variable} h-screen overflow-hidden bg-[#0c0c0c]/20 relative flex flex-col items-center justify-center px-4 py-16 md:px-6 md:py-0 xl:px-0`}
    >
      {/* Background Grid at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-1/2">
        <Image
          src={contactGridSvg}
          alt="Contact grid"
          fill
          className="object-cover object-bottom opacity-40 md:opacity-60"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full text-center md:max-w-lg md:mx-auto xl:max-w-4xl xl:px-8">
        {/* Speaker Icon */}
        <div className="mb-6 xl:mb-8">
          {/* Mobile icon */}
          <Image 
            src={contactSvg}
            alt="Contact"
            width={60}
            height={60}
            className="mx-auto md:hidden"
          />
          {/* Tablet icon */}
          <Image 
            src={contactSvg}
            alt="Contact"
            width={80}
            height={80}
            className="mx-auto hidden md:block xl:hidden"
          />
          {/* Desktop icon */}
          <Image 
            src={contactSvg}
            alt="Contact"
            width={100}
            height={100}
            className="mx-auto hidden xl:block"
          />
        </div>

        {/* Main Text */}
        <p className="text-white text-sm mb-8 mx-auto leading-relaxed md:text-lg md:mb-10 xl:text-xl xl:mb-12 xl:max-w-2xl">
          I am actively seeking opportunities to start my career as a Software Engineer or AI/ML Engineer. If you are looking for a motivated and skilled professional to join your team, please reach out to me.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mb-12 md:flex-row md:gap-4 md:justify-center xl:gap-6 xl:mb-16">
          <button 
            onClick={() => window.open('https://www.linkedin.com/in/imsounic/', '_blank')}
            className="w-full bg-[#E9F5DB] text-black px-4 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-[#E9F5DB]/90 transition-colors md:w-auto md:px-6 xl:px-8"
          >
            Let&apos;s Talk
            {/* Mobile hand icon */}
            <Image
              src={handSvg}
              alt="Hand icon"
              width={18}
              height={18}
              className="md:hidden"
            />
            {/* Tablet hand icon */}
            <Image
              src={handSvg}
              alt="Hand icon"
              width={20}
              height={20}
              className="hidden md:block xl:hidden"
            />
            {/* Desktop hand icon */}
            <Image
              src={handSvg}
              alt="Hand icon"
              width={24}
              height={24}
              className="hidden xl:block"
            />
          </button>
          
          <button 
            onClick={() => window.open('/Resume.pdf', '_blank')}
            className="btn-circle-fill w-full border border-dashed border-[#E9F5DB] text-[#E9F5DB] px-4 py-3 rounded-md font-medium transition-colors md:w-auto md:px-6 xl:px-8"
          >
            <CircleFillOverlay />
            <span className="relative z-10">View my Resume</span>
          </button>
        </div>
      </div>

      {/* Contact Icons - Stacked on mobile, row on tablet/desktop */}
      <div className="relative z-10 w-full md:absolute md:bottom-6 md:px-8 xl:bottom-8">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:max-w-xl md:mx-auto xl:max-w-7xl">
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/imsounic/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 glass px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group md:w-auto md:py-2 xl:px-6 xl:py-3"
          >
            <div className="w-8 h-8 flex items-center justify-center xl:w-10 xl:h-10">
              <Image 
                src={linkedinSvg}
                alt="LinkedIn"
                width={20}
                height={20}
                className="md:hidden"
              />
              <Image 
                src={linkedinSvg}
                alt="LinkedIn"
                width={24}
                height={24}
                className="hidden md:block xl:hidden"
              />
              <Image 
                src={linkedinSvg}
                alt="LinkedIn"
                width={30}
                height={30}
                className="hidden xl:block"
              />
            </div>
            <span className="text-white flex-1 md:flex-none md:text-sm xl:text-base">LinkedIn</span>
            <div className="w-4 h-4 flex items-center justify-center xl:w-5 xl:h-5">
              <Image 
                src={arrowSvg}
                alt="Arrow"
                width={16}
                height={16}
                className="group-hover:translate-x-1 transition-transform xl:hidden"
              />
              <Image 
                src={arrowSvg}
                alt="Arrow"
                width={20}
                height={20}
                className="group-hover:translate-x-1 transition-transform hidden xl:block"
              />
            </div>
          </a>

          {/* Mail */}
          <a 
            href="mailto:imsounic@gmail.com"
            className="w-full flex items-center gap-2 glass px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group md:w-auto md:py-2 xl:px-6 xl:py-3"
          >
            <div className="w-8 h-8 flex items-center justify-center xl:w-10 xl:h-10">
              <Image 
                src={mailSvg}
                alt="Mail"
                width={20}
                height={20}
                className="md:hidden"
              />
              <Image 
                src={mailSvg}
                alt="Mail"
                width={24}
                height={24}
                className="hidden md:block xl:hidden"
              />
              <Image 
                src={mailSvg}
                alt="Mail"
                width={30}
                height={30}
                className="hidden xl:block"
              />
            </div>
            <span className="text-white flex-1 md:flex-none md:text-sm xl:text-base">Mail</span>
            <div className="w-4 h-4 flex items-center justify-center xl:w-5 xl:h-5">
              <Image 
                src={arrowSvg}
                alt="Arrow"
                width={16}
                height={16}
                className="group-hover:translate-x-1 transition-transform xl:hidden"
              />
              <Image 
                src={arrowSvg}
                alt="Arrow"
                width={20}
                height={20}
                className="group-hover:translate-x-1 transition-transform hidden xl:block"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
