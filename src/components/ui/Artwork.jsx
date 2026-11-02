/** Render only trusted, local illustration generators. Never pass user input here. */
export function Artwork({ markup, className, ...props }) {
  return <div className={className} {...props} dangerouslySetInnerHTML={{ __html: markup }} />;
}
