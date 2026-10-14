'use client'

import { ConvPrinter } from '@/themes/contributions/conv/ConvPrinter'

// ─── A CONVOLUTION, BY HAND: the contact printer (anatomy figure) ─────
export function Convolution() {
  return (
    <section className="dk-section dk-conv" aria-labelledby="conv-title">
      <div data-reveal>
        <h2 id="conv-title" className="dk-conv__title">A convolution, by hand</h2>
        <p className="dk-conv__text">
          The CNN in the hero does this thousands of times. Here it is once, as a contact printer: nine weights slide
          over every pixel of the negative and print a feature map.
        </p>
        <p className="dk-conv__hint">Pick a kernel: edges, blur or sharpen.</p>
      </div>
      <ConvPrinter />
    </section>
  )
}
