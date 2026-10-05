import styles from './Button.module.css'

const VARIANTS = {
  primary: styles.primary,
  secondary: styles.secondary,
  secondaryOnLight: styles.secondaryOnLight,
  whatsapp: styles.whatsapp,
  ghost: styles.ghost,
}

/** Shared CTA button. Renders an <a> when `href` is given, else a <button>. */
export default function Button({
  as,
  href,
  variant = 'primary',
  size,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  external = false,
  ...rest
}) {
  const classes = [styles.btn, VARIANTS[variant] || styles.primary, size === 'sm' ? styles.sm : '', className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className={styles.icon} aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className={styles.icon} aria-hidden="true" />}
    </>
  )

  const Tag = as || (href ? 'a' : 'button')

  if (Tag === 'a') {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={rest.type || 'button'} className={classes} {...rest}>
      {content}
    </button>
  )
}
