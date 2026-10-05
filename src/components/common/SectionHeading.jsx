import styles from './SectionHeading.module.css'

export default function SectionHeading({
  eyebrow,
  heading,
  lede,
  align = 'left',
  headingLevel = 'h2',
  className = '',
  headingClassName = 'h-xl',
}) {
  const HeadingTag = headingLevel
  return (
    <div className={[styles.wrap, align === 'center' ? styles.center : '', className].filter(Boolean).join(' ')}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <HeadingTag className={`${headingClassName} ${styles.heading}`}>{heading}</HeadingTag>
      {lede && <p className={`lede ${styles.lede}`}>{lede}</p>}
    </div>
  )
}
