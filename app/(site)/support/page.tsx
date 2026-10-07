'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, CardBody, CardHeader } from '@heroui/react'
import { BookOpen, LifeBuoy, Mail } from 'lucide-react'
import { Footer } from '@/components/layout/footer'
import { SiteHeader } from '@/components/layout/header'

export default function SupportPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <SiteHeader />
      <main className='flex-grow max-w-7xl mx-auto px-4 py-12'>
        <div className='max-w-3xl mx-auto'>
          <Card className='shadow-xl rounded-xl p-2 bg-background'>
            <CardHeader className='flex flex-col items-center text-center pt-6 pb-2'>
              <div className='inline-flex items-center justify-center rounded-full bg-secondary/10 p-3 mb-4'>
                <LifeBuoy className='h-10 w-10 text-secondary' />
              </div>
              <h1 className='text-3xl font-bold text-primary'>AddressData Support</h1>
              <p className='text-lg text-muted-foreground mt-1'>
                Get help with your account, address workflows, or API integration.
              </p>
            </CardHeader>
            <CardBody className='space-y-8 pt-0 text-foreground/90'>
              <div className='flex justify-center my-4'>
                <Image
                  src='https://res.cloudinary.com/seapane-cloud/seapane-bucket/addressdata/meta/address-illustration-pana.svg'
                  alt='Support illustration'
                  width={300}
                  height={250}
                />
              </div>
              <section className='text-center space-y-4'>
                <h2 className='text-2xl font-semibold text-primary'>Contact our team</h2>
                <p>
                  Email us with your question and include the endpoint or workflow involved, along with any relevant request ID.
                  Do not include API secrets or private credentials.
                </p>
                <Button
                  as={Link}
                  href='mailto:support@addressdata.ng'
                  color='warning'
                  className='shadow-md text-primary font-semibold'
                  radius='md'
                  startContent={<Mail className='h-4 w-4' />}
                >
                  support@addressdata.ng
                </Button>
              </section>
              <section className='text-center border-t border-border pt-6'>
                <p className='mb-3'>Looking for API setup details?</p>
                <Button
                  as={Link}
                  href='/docs'
                  variant='bordered'
                  color='secondary'
                  radius='md'
                  startContent={<BookOpen className='h-4 w-4' />}
                >
                  Read the developer documentation
                </Button>
              </section>
            </CardBody>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
