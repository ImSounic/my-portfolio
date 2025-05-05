// src/components/tablet/ContactSection.tsx
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
      className={`${satoshi.variable} min-h-screen bg-black relative flex flex-col items-center justify-center snap-start px-6`}
    >
      {/* Background Grid at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/2">
        <Image
          src={contactGridSvg}
          alt="Contact grid"
          fill
          className="object-cover object-bottom opacity-60"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        {/* Speaker Icon */}
        <div className="mb-6">
          <Image 
            src={contactSvg}
            alt="Contact"
            width={80}
            height={80}
            className="mx-auto"
          />
        </div>

        {/* Main Text */}
        <p className="text-white text-lg mb-10 mx-auto leading-relaxed">
          I am actively seeking opportunities to start my career as a Software Engineer or AI/ML Engineer. If you are looking for a motivated and skilled professional to join your team, please reach out to me.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-12">
          <button 
            onClick={() => window.open('https://linkedin.com/in/yourprofile', '_blank')}
            className="bg-[#E9F5DB] text-black px-6 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-[#E9F5DB]/90 transition-colors"
          >
            Let&apos;s Talk
            <Image
              src={handSvg}
              alt="Hand icon"
              width={20}
              height={20}
            />
          </button>
          
          <button 
            onClick={() => window.open('/resume.pdf', '_blank')}
            className="border border-dashed border-[#E9F5DB] text-[#E9F5DB] px-6 py-3 rounded-md font-medium hover:bg-[#E9F5DB] hover:text-black transition-colors"
          >
            View my Resume
          </button>
        </div>
      </div>

      {/* Contact Icons at bottom with glassmorphism */}
      <div className="absolute bottom-6 w-full px-8">
        <div className="flex justify-between max-w-xl mx-auto">
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/imsounic/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Image 
                src={linkedinSvg}
                alt="LinkedIn"
                width={24}
                height={24}
              />
            </div>
            <span className="text-white text-sm">LinkedIn</span>
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
            className="flex items-center gap-2 glass px-4 py-2 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Image 
                src={mailSvg}
                alt="Mail"
                width={24}
                height={24}
              />
            </div>
            <span className="text-white text-sm">Mail</span>
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