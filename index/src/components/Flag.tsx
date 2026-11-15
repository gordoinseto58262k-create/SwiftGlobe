export function Flag({ src, className = "h-4 w-6" }: { src: string; className?: string }) {
  return <img src={src} alt="" loading="lazy" className={`${className} shrink-0 rounded-sm object-cover shadow-sm`} />;
}
