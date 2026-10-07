'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Code,
} from '@heroui/react'
import {
  CheckCircle,
  DatabaseZap,
  SearchCheck,
  KeyRound,
  MapPin,
  ShieldCheck,
  Gauge,
  Layers,
  Search,
} from 'lucide-react'
import { SiteHeader } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const features = [
    {
      icon: <MapPin className='h-8 w-8 text-secondary' />,
      title: 'Addresses That Fit Each Place',
      description:
        'Capture addresses in the formats people use locally, then organize them into a consistent structure across countries.',
      dataAiHint: 'map location',
    },
    {
      icon: <ShieldCheck className='h-8 w-8 text-secondary' />,
      title: 'Address Verification',
      description:
        'Compare address details with trusted location data and route uncertain matches for review.',
      dataAiHint: 'AI checkmark',
    },
    {
      icon: <KeyRound className='h-8 w-8 text-secondary' />,
      title: 'Developer API Access',
      description:
        'Use one API and SDK to validate, standardize, and find addresses across supported countries.',
      dataAiHint: 'API key',
    },
    {
      icon: <SearchCheck className='h-8 w-8 text-secondary' />,
      title: 'Smart Autocomplete',
      description:
        'Help people complete address forms with relevant place and address suggestions.',
      dataAiHint: 'search complete',
    },
    {
      icon: <DatabaseZap className='h-8 w-8 text-secondary' />,
      title: 'Structured Storage',
      description:
        'Keep address records consistent and useful across products, teams, and regions.',
      dataAiHint: 'database structure',
    },
    {
      icon: <Gauge className='h-8 w-8 text-secondary' />,
      title: 'Built for Reliable Access',
      description:
        'Designed to support dependable address workflows as your products and markets grow.',
      dataAiHint: 'performance gauge',
    },
    {
      icon: <Layers className='h-8 w-8 text-secondary' />,
      title: 'Global Geography Data',
      description:
        'Work with country and postal data worldwide, with detailed Nigerian states, LGAs, and cities.',
      dataAiHint: 'geography database',
    },
  ]

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <SiteHeader />
      <main className='flex-grow'>
        {/* Hero Section */}
        <section
          className='relative py-20 md:py-32 bg-gradient-to-br from-background to-primary/5 bg-cover bg-center overflow-hidden'
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/seapane-cloud/seapane-bucket/addressdata/hero.jpg')",
          }}
        >
          <div
            className='absolute bottom-0 left-0 w-full h-24 bg-background'
            style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}
          ></div>
          <div
            className='absolute bottom-0 right-0 w-full h-24 bg-background'
            style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 0)' }}
          ></div>
          <div className='container mx-auto px-4 text-center relative z-10'>
            <div className='flex justify-center mb-6'>
              <Image
                src='https://res.cloudinary.com/seapane-cloud/seapane-bucket/addressdata/meta/addressdata-logomark.svg'
                alt='AddressData Logomark'
                width={64}
                height={64}
                className='text-primary'
                data-ai-hint='logo brand'
              />
            </div>
            <h1 className='text-4xl md:text-6xl font-bold tracking-tight text-primary'>
              One Address Platform. From Nigeria to the World.
            </h1>
            <div className='mt-10 max-w-xl mx-auto'>
              <form onSubmit={handleSearchSubmit} className='flex gap-2'>
                <Input
                  aria-label='Search Nigerian addresses or estates'
                  placeholder='Search a Nigerian address or estate'
                  variant='bordered'
                  size='lg'
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  classNames={{
                    inputWrapper: 'bg-background/80 backdrop-blur-sm',
                  }}
                />
                <Button
                  isIconOnly
                  type='submit'
                  size='lg'
                  color='warning'
                  aria-label='Search'
                  className='text-primary'
                >
                  <Search className='h-5 w-5' />
                </Button>
              </form>
            </div>
            <p className='mt-6 text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto'>
              AddressData gives developers, businesses, and operations teams
              one platform to validate, standardize, store, and retrieve
              address data across countries, with deeper address intelligence
              for Nigeria.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-16 bg-background'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='flex flex-col lg:flex-row items-center gap-12'>
              <div className='lg:w-1/2'>
                <Image
                  src='https://res.cloudinary.com/seapane-cloud/seapane-bucket/addressdata/meta/address-illustration-amico.svg'
                  alt='Features Illustration'
                  width={500}
                  height={450}
                  className='mx-auto'
                  data-ai-hint='data features'
                />
              </div>
              <div className='lg:w-1/2'>
                <h2 className='text-3xl md:text-4xl font-bold text-primary mb-4'>
                  Why AddressData?
                </h2>
                <p className='text-foreground/80 mb-8 md:mb-12'>
                  Work with addresses across countries through one platform,
                  with deeper geographic and address intelligence for Nigeria.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  {features.slice(0, 4).map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-start space-x-3 p-4 rounded-lg hover:bg-primary/5 transition-colors'
                    >
                      <div className='flex-shrink-0 mt-1'>{feature.icon}</div>
                      <div>
                        <h3 className='font-bold text-lg text-primary'>
                          {feature.title}
                        </h3>
                        <p className='text-sm text-foreground/70'>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16'>
              {features.slice(4).map((feature, index) => (
                <Card
                  key={index}
                  isHoverable
                  shadow='md'
                  radius='lg'
                  className='transition-shadow bg-background hover:shadow-primary/20'
                >
                  <CardHeader className='flex flex-col items-center pt-6 pb-2'>
                    <div className='flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4'>
                      {feature.icon}
                    </div>
                    <h3 className='font-bold text-xl text-center text-primary'>
                      {feature.title}
                    </h3>
                  </CardHeader>
                  <CardBody className='pt-0 pb-6 text-center'>
                    <p className='text-sm text-foreground/70'>
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Section */}
        <section id='api' className='py-8 bg-primary/5'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='flex flex-col lg:flex-row items-center gap-12'>
              <div className='lg:w-1/2'>
                <h2 className='text-3xl md:text-4xl font-bold text-primary mb-4'>
                  One API for Addresses Around the World
                </h2>
                <p className='text-foreground/80 mb-4 text-lg'>
                  Build global address workflows with one API and SDK, with Nigeria-specific geography, postcode support, and estate data. We aim to integrate with NIPOST’s Digital Postcode through an authorized connection.
                </p>
                <ul className='space-y-3 text-foreground/80 mb-6'>
                  {[
                    {
                      icon: (
                        <CheckCircle className='h-5 w-5 text-secondary mr-2 flex-shrink-0' />
                      ),
                      text: '/api/v1/validate: Validate and standardize address details across supported countries.',
                    },
                    {
                      icon: (
                        <CheckCircle className='h-5 w-5 text-secondary mr-2 flex-shrink-0' />
                      ),
                      text: '/api/v1/autocomplete: Find relevant places and address suggestions.',
                    },
                    {
                      icon: (
                        <CheckCircle className='h-5 w-5 text-secondary mr-2 flex-shrink-0' />
                      ),
                      text: '/api/v1/geography/states: Access detailed Nigerian state and LGA data.',
                    },
                    {
                      icon: (
                        <CheckCircle className='h-5 w-5 text-secondary mr-2 flex-shrink-0' />
                      ),
                      text: '@addressdata/sdk: Use the same address tools from TypeScript and Bun.',
                    },
                  ].map((item) => (
                    <li key={item.text} className='flex items-center'>
                      {item.icon}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <div className='flex flex-wrap items-center gap-3'>
                  <Button
                    size='lg'
                    color='warning'
                    as={Link}
                    href='/docs'
                    radius='md'
                    className='text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out font-semibold'
                  >
                    View API Documentation
                  </Button>
                  <Code className='text-sm px-3 py-2 rounded-lg bg-default-100 border border-default-200 font-mono'>
                    bun add @addressdata/sdk
                  </Code>
                </div>
              </div>
              <div className='lg:w-1/2'>
                <Image
                  src='https://res.cloudinary.com/seapane-cloud/seapane-bucket/addressdata/meta/address-illustration-rafiki.svg'
                  alt='API illustration'
                  width={600}
                  height={400}
                  className='rounded-lg'
                  data-ai-hint='API development'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          className='relative py-20 md:py-32 bg-cover bg-center'
          style={{ backgroundImage: "url('/media/addressdata-footer.jpg')" }}
        >
          <div className='absolute inset-0 bg-primary/80'></div>
          <div className='max-w-7xl mx-auto px-4 text-center relative z-10'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-white'>
              Build Address Experiences for Every Market
            </h2>
            <p className='text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90'>
              Bring country-specific address data into one consistent workflow
              as your business grows across borders.
            </p>
            <Button
              size='lg'
              as={Link}
              href='/login'
              radius='md'
              className='bg-warning text-primary hover:bg-warning/90 shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out'
            >
              Access Portal
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
