// src/components/mobile/ContactSection.tsx
'use client'

import Image from 'next/image'
import localFont from 'next/font/local'
import contactGridSvg from '@/assets/images/contact-grid.svg'
import contactSvg from '@/assets/icons/contact.svg'
import linkedinSvg from '@/assets/icons/linkedin.svg'
import mailSvg from '@/assets/icons/mail.svg'
import arrowSvg from '@/assets/icons/arrow.svg'
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
      className={`${satoshi.variable} min-h-screen bg-[#0c0c0c] relative flex flex-col items-center justify-center snap-start px-4 py-16`}
    >
      {/* Background Grid at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/3">
        <Image
          src={contactGridSvg}
          alt="Contact grid"
          fill
          className="object-cover object-bottom opacity-40"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full text-center">
        {/* Speaker Icon */}
        <div className="mb-6">
          <Image 
            src={contactSvg}
            alt="Contact"
            width={60}
            height={60}
            className="mx-auto"
          />
        </div>

        {/* Main Text */}
        <p className="text-white text-sm mb-8 mx-auto leading-relaxed">
          I am actively seeking opportunities to start my career as a Software Engineer or AI/ML Engineer. If you are looking for a motivated and skilled professional to join your team, please reach out to me.
        </p>

        {/* Buttons - Full width in mobile */}
        <div className="flex flex-col gap-3 mb-12">
          <button 
            onClick={() => window.open('https://linkedin.com/in/yourprofile', '_blank')}
            className="w-full bg-[#E9F5DB] text-black px-4 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-[#E9F5DB]/90 transition-colors"
          >
            Let&apos;s Talk
            <Image
              src={handSvg}
              alt="Hand icon"
              width={18}
              height={18}
            />
          </button>
          
          <button 
            onClick={() => window.open('/resume.pdf', '_blank')}
            className="w-full border border-dashed border-[#E9F5DB] text-[#E9F5DB] px-4 py-3 rounded-md font-medium hover:bg-[#E9F5DB] hover:text-black transition-colors"
          >
            View my Resume
          </button>
        </div>
      </div>

      {/* Contact Icons - Stacked on mobile */}
      <div className="relative z-10 w-full">
        <div className="flex flex-col gap-3">
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/imsounic/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 glass px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Image 
                src={linkedinSvg}
                alt="LinkedIn"
                width={20}
                height={20}
              />
            </div>
            <span className="text-white flex-1">LinkedIn</span>
            <div className="w-4 h-4 flex items-center justify-center">
              <Image 
                src={arrowSvg}
                alt="Arrow"
                width={16}
                height={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </a>

          {/* Mail */}
          <a 
            href="mailto:imsounic@gmail.com"
            className="w-full flex items-center gap-2 glass px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Image 
                src={mailSvg}
                alt="Mail"
                width={20}
                height={20}
              />
            </div>
            <span className="text-white flex-1">Mail</span>
            <div className="w-4 h-4 flex items-center justify-center">
              <Image 
                src={arrowSvg}
                alt="Arrow"
                width={16}
                height={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}