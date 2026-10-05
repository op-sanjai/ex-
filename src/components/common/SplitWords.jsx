/**
 * Splits text into per-word spans with an overflow-hidden mask wrapper,
 * the standard structure for a GSAP "words rise into place" reveal.
 * Consumers animate `.word-inner` (transform/opacity) — never layout
 * properties — via ScrollTrigger-driven timelines.
 */
export default function SplitWords({ text, className, wordClassName }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span className="word-mask" key={`${word}-${i}`}>
          <span className={`word-inner${wordClassName ? ` ${wordClassName}` : ''}`}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
