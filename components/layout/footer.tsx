'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className='py-8 border-t bg-background'>
      <div className='max-w-7xl mx-auto px-4 text-center text-muted-foreground'>
        <p className='mb-2'>Global address tools, built in Nigeria.</p>
        <p className='text-sm'>
          &copy; {new Date().getFullYear()} AddressData by{' '}
          <Link
            href='https://haqqman.com'
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary hover:text-secondary no-underline'
          >
            Haqqman
          </Link>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
