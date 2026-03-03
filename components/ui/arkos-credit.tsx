import Link from 'next/link';
import Image from 'next/image';

export function ArkosCredit() {
  return (
    <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
      <span>Diseñado y desarrollado por</span>
      <Link 
        href="https://xn--rkos-4na.com" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Árkos - Agencia de Desarrollo Web y Diseño UX/UI"
        className="font-medium hover:text-secondary transition-colors flex items-center gap-1"
      >
        <Image 
          src="/arkos-logo-light.svg" 
          alt="Árkos Logo" 
          width={16} 
          height={16} 
          className="dark:hidden opacity-80"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <Image 
          src="/arkos-logo-dark.svg" 
          alt="Árkos Logo" 
          width={16} 
          height={16} 
          className="hidden dark:block opacity-80"
        />
        Árkos
      </Link>
    </div>
  );
}
