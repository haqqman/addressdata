'use client'

import { SiteHeader } from '@/components/layout/header'
import {
  Link,
  Divider,
  Code,
  Tabs,
  Tab,
  Card,
  CardBody,
  Chip,
} from '@heroui/react'
import {
  BookOpen,
  Code2,
  Zap,
  ShieldCheck,
  MapPinned,
  HelpCircle,
  Layers,
  AlertTriangle,
  Tag,
  Building,
  Map as MapIcon,
  Package,
  Terminal,
  Globe,
  Sparkles,
} from 'lucide-react'
import { Footer } from '@/components/layout/footer'

const API_BASE_URL = 'https://api.addressdata.ng/api/v1'

export default function DocsPage() {
  const sdkInstallBun = `bun add @addressdata/sdk`
  const sdkInstallNpm = `npm install @addressdata/sdk`

  const sdkUsageExample = `import { addressData } from '@addressdata/sdk'

// 1. Address validation with country-aware rules and Nigeria-specific intelligence
const validation = await addressData.validate({
  country: 'NG',
  state: 'Lagos',
  lga: 'Ikeja',
  street: '15 Allen Avenue',
  nipostPostcode: 'LA01A03FK01'
})

console.log(validation.isValid) // true
console.log(validation.standardized.formattedAddress)
// "15 Allen Avenue, Ikeja, Ikeja LGA, Lagos State, LA-01-A03-FK-01, Nigeria"

// 2. Ultra-Fast Autocomplete (Estates, Cities & LGAs)
const suggestions = await addressData.autocomplete('Carlton Gate')
console.log(suggestions)

// 3. Validate Nigerian administrative geography
const isValidLocation = addressData.nigeria.validateHierarchy('Lagos', 'Ikeja')
console.log(isValidLocation.isValid)`

  const authExample = `// Include your API key in either header:
// Option A: X-Public-Key (Recommended)
// Option B: Authorization: Bearer <API_KEY>

curl -X POST "${API_BASE_URL}/validate" \\
  -H "X-Public-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "country": "NG",
    "state": "Lagos",
    "lga": "Ikeja",
    "street": "15 Allen Avenue"
  }'`

  const validateRequest = `{
  "country": "NG",
  "state": "Lagos",
  "lga": "Ikeja",
  "city": "Ikeja",
  "street": "15 Allen Avenue",
  "estate": "Carlton Gate Estate",
  "nipostPostcode": "LA01A03FK01"
}`

  const validateResponse = `{
  "success": true,
  "data": {
    "isValid": true,
    "confidence": "exact",
    "country": {
      "code": "NG",
      "name": "Nigeria",
      "flag": "🇳🇬"
    },
    "standardized": {
      "street": "15 Allen Avenue",
      "city": "Ikeja",
      "state": "Lagos",
      "lga": "Ikeja",
      "country": "Nigeria",
      "formattedAddress": "15 Allen Avenue, Carlton Gate Estate, Ikeja, Ikeja LGA, Lagos State, LA-01-A03-FK-01, Nigeria"
    },
    "errors": [],
    "warnings": [],
    "intelligence": {
      "nigeria": {
        "state": "Lagos",
        "stateCode": "LA",
        "capital": "Ikeja",
        "geopoliticalZone": "South West",
        "lga": "Ikeja",
        "lgaValidForState": true,
        "isFctDistrict": false,
        "nipostPostcode": "LA-01-A03-FK-01",
        "estateMatched": {
          "id": "carlton-gate-ikeja",
          "name": "Carlton Gate Estate",
          "state": "Lagos",
          "lga": "Ikeja"
        }
      }
    }
  }
}`

  const autocompleteResponse = `{
  "success": true,
  "query": "Ikeja",
  "count": 2,
  "data": [
    {
      "id": "lga:ikeja",
      "label": "Ikeja",
      "secondaryLabel": "Lagos State",
      "type": "lga",
      "country": "NG"
    },
    {
      "id": "estate:carlton-gate-ikeja",
      "label": "Carlton Gate Estate",
      "secondaryLabel": "Ikeja, Lagos",
      "type": "estate",
      "country": "NG"
    }
  ]
}`

  const countriesResponse = `{
  "success": true,
  "count": 250,
  "data": [
    {
      "code": "NG",
      "name": "Nigeria",
      "capital": "Abuja",
      "dialCode": "+234",
      "flag": "🇳🇬",
      "hasPostalCodes": true,
      "adminLevelName": "state"
    },
    {
      "code": "GB",
      "name": "United Kingdom",
      "capital": "London",
      "dialCode": "+44",
      "flag": "🇬🇧",
      "hasPostalCodes": true,
      "adminLevelName": "county"
    }
  ]
}`

  const statesResponse = `{
  "success": true,
  "count": 37,
  "data": [
    {
      "id": "lagos",
      "name": "Lagos",
      "capital": "Ikeja",
      "code": "LA",
      "zone": "South West"
    },
    {
      "id": "fct",
      "name": "Federal Capital Territory",
      "capital": "Abuja",
      "code": "FC",
      "zone": "North Central"
    }
  ]
}`

  const lgasResponse = `{
  "success": true,
  "state": "Lagos",
  "count": 20,
  "data": [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti-Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere"
  ]
}`

  const estatesResponse = `{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "carlton-gate-estate",
      "name": "Carlton Gate Estate",
      "state": "Lagos",
      "lga": "Ikeja",
      "status": "verified"
    }
  ]
}`

  return (
    <div className='flex flex-col min-h-screen'>
      <SiteHeader />
      <main className='flex-grow max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 lg:gap-16 items-start'>
        {/* Sticky Sidebar Navigation */}
        <aside className='w-full md:w-64 flex-shrink-0'>
          <div className='md:sticky md:top-28 space-y-8'>
            <div>
              <h3 className='font-semibold text-lg text-primary mb-4'>Getting Started</h3>
              <ul className='space-y-3 text-sm'>
                <li>
                  <Link href='#introduction' className='text-foreground/80 hover:text-secondary transition-colors'>
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link href='#sdk-quickstart' className='text-foreground/80 hover:text-secondary transition-colors font-medium'>
                    TypeScript / Bun SDK
                  </Link>
                </li>
                <li>
                  <Link href='#authentication' className='text-foreground/80 hover:text-secondary transition-colors'>
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link href='#rate-limiting' className='text-foreground/80 hover:text-secondary transition-colors'>
                    Rate Limits (100 Free/Day)
                  </Link>
                </li>
                <li>
                  <Link href='#base-url' className='text-foreground/80 hover:text-secondary transition-colors'>
                    API Base URL
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-lg text-primary mb-4'>REST Endpoints</h3>
              <ul className='space-y-3 text-sm'>
                <li>
                  <Link href='#validate-endpoint' className='text-foreground/80 hover:text-secondary transition-colors'>
                    POST /validate
                  </Link>
                </li>
                <li>
                  <Link href='#autocomplete-endpoint' className='text-foreground/80 hover:text-secondary transition-colors'>
                    GET /autocomplete
                  </Link>
                </li>
                <li>
                  <Link href='#geography-countries' className='text-foreground/80 hover:text-secondary transition-colors'>
                    GET /geography/countries
                  </Link>
                </li>
                <li>
                  <Link href='#geography-states' className='text-foreground/80 hover:text-secondary transition-colors'>
                    GET /geography/states
                  </Link>
                </li>
                <li>
                  <Link href='#geography-lgas' className='text-foreground/80 hover:text-secondary transition-colors'>
                    GET /geography/states/:id/lgas
                  </Link>
                </li>
                <li>
                  <Link href='#estates-endpoint' className='text-foreground/80 hover:text-secondary transition-colors'>
                    GET /estates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-lg text-primary mb-4'>Reference</h3>
              <ul className='space-y-3 text-sm'>
                <li>
                  <Link href='#error-handling' className='text-foreground/80 hover:text-secondary transition-colors'>
                    Error Codes &amp; Headers
                  </Link>
                </li>
                <li>
                  <Link href='#support' className='text-foreground/80 hover:text-secondary transition-colors'>
                    Support &amp; Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className='flex-grow max-w-4xl min-w-0'>
          <div className='mb-12'>
            <div className='inline-flex items-center justify-center rounded-xl bg-secondary/10 p-4 mb-6'>
              <BookOpen className='h-8 w-8 text-secondary' />
            </div>
            <h1 className='text-3xl md:text-5xl font-bold text-primary tracking-tight'>
              Developer Documentation
            </h1>
            <p className='text-xl text-muted-foreground mt-4'>
              Use one API and SDK for address workflows across supported countries, with deeper Nigerian geography and address intelligence.
            </p>
          </div>

          <div className='space-y-16 text-lg text-foreground/90'>
            {/* Introduction */}
            <section id='introduction'>
              <h2 className='text-2xl font-semibold mb-3 flex items-center text-primary'>
                <Zap className='mr-2 h-6 w-6 text-secondary' /> Introduction
              </h2>
              <p>
                AddressData is a global address intelligence platform built in Nigeria. It brings country-aware address validation,
                formatting, and geography into one developer integration, with deeper Nigerian state, LGA, FCT district, and estate data.
                Our planned direction is to support Nigeria's Digital Postcode through an authorized integration, with NIPOST remaining
                the source for issued postcode records and building locations.
              </p>
            </section>

            <Divider />

            {/* SDK Quickstart */}
            <section id='sdk-quickstart'>
              <div className='flex items-center justify-between mb-3'>
                <h2 className='text-2xl font-semibold flex items-center text-primary'>
                  <Package className='mr-2 h-6 w-6 text-secondary' /> TypeScript &amp; Bun SDK
                </h2>
                <Chip color='success' variant='flat' size='sm' startContent={<Sparkles className='h-3 w-3' />}>
                  Official Client
                </Chip>
              </div>
              <p className='mb-4'>
                The fastest way to use AddressData in modern JavaScript and TypeScript environments is via the official SDK:
              </p>

              <Tabs color='warning' variant='bordered' className='mb-4'>
                <Tab key='bun' title='Bun (Recommended)'>
                  <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm'>
                    {sdkInstallBun}
                  </Code>
                </Tab>
                <Tab key='npm' title='npm / pnpm / yarn'>
                  <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm'>
                    {sdkInstallNpm}
                  </Code>
                </Tab>
              </Tabs>

              <p className='text-base font-semibold mt-4 mb-2'>Example SDK Integration:</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {sdkUsageExample}
              </Code>
            </section>

            <Divider />

            {/* Authentication */}
            <section id='authentication'>
              <h2 className='text-2xl font-semibold mb-3 flex items-center text-primary'>
                <ShieldCheck className='mr-2 h-6 w-6 text-secondary' /> Authentication
              </h2>
              <p>
                All REST API requests require a valid API key generated from your{' '}
                <Link href='/api-keys' className='text-secondary underline font-semibold'>
                  Developer Portal
                </Link>
                . Pass your key in either of the following headers:
              </p>
              <ul className='list-disc list-inside text-base mt-2 space-y-1 ml-4'>
                <li>
                  <Code>X-Public-Key: YOUR_API_KEY</Code> (Recommended)
                </li>
                <li>
                  <Code>Authorization: Bearer YOUR_API_KEY</Code>
                </li>
                <li>
                  <Code>x-api-key: YOUR_API_KEY</Code>
                </li>
              </ul>

              <p className='text-base font-semibold mt-4 mb-2'>cURL Request Example:</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {authExample}
              </Code>
            </section>

            <Divider />

            {/* Rate Limiting & Pricing */}
            <section id='rate-limiting'>
              <h2 className='text-2xl font-semibold mb-3 flex items-center text-primary'>
                <Tag className='mr-2 h-6 w-6 text-secondary' /> Rate Limits &amp; Free Tier
              </h2>
              <Card className='bg-primary/5 border border-primary/20 mb-6'>
                <CardBody className='p-6'>
                  <div className='flex items-start gap-4'>
                    <div className='bg-warning/20 text-primary p-3 rounded-xl'>
                      <Sparkles className='h-6 w-6' />
                    </div>
                    <div>
                      <h3 className='font-bold text-xl text-primary mb-1'>100 Free Requests Per Day</h3>
                      <p className='text-base text-foreground/80'>
                        Every developer account includes <strong>100 free requests per calendar day</strong>. Ideal for local
                        development, automated testing, and indie prototypes.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <p className='text-base mb-2'>Every response includes real-time rate limit headers:</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm'>
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 84
X-RateLimit-Reset: 1728345600`}
              </Code>

              <p className='text-base mt-4'>
                Once your daily free quota is reached, subsequent requests return HTTP <Code>429 Too Many Requests</Code>. Contact our
                team to scale to dedicated Growth or Enterprise volume plans.
              </p>
            </section>

            <Divider />

            {/* Base URL */}
            <section id='base-url'>
              <h2 className='text-2xl font-semibold mb-3 flex items-center text-primary'>
                <Layers className='mr-2 h-6 w-6 text-secondary' /> API Base URL
              </h2>
              <p>All REST API endpoints are served securely over HTTPS:</p>
              <Code className='mt-2 text-base max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm'>
                {API_BASE_URL}
              </Code>
            </section>

            <Divider />

            {/* POST /validate */}
            <section id='validate-endpoint'>
              <div className='flex items-center gap-3 mb-2'>
                <Chip color='primary' variant='solid' className='font-mono font-bold'>
                  POST
                </Chip>
                <h3 className='text-2xl font-semibold text-primary font-mono'>/validate</h3>
              </div>
              <p className='text-muted-foreground text-base mb-4'>
                Validates and standardizes address details for supported countries. For Nigeria, it checks state-to-LGA hierarchy,
                validates postcode format, and matches approved estates. Confirming that a Digital Postcode is assigned to a building
                is planned through an authorized NIPOST integration.
              </p>

              <p className='text-base font-semibold mb-1'>Request Body (JSON):</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm mb-4'>
                {validateRequest}
              </Code>

              <p className='text-base font-semibold mb-1'>Success Response (200 OK):</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {validateResponse}
              </Code>
              <p className='text-sm text-muted-foreground mt-3'>
                The <Code>nipostValid</Code> result checks postcode format. Confirming that a Digital Postcode is assigned to a
                building requires resolution against NIPOST records through the planned authorized integration.
              </p>
            </section>

            <Divider />

            {/* GET /autocomplete */}
            <section id='autocomplete-endpoint'>
              <div className='flex items-center gap-3 mb-2'>
                <Chip color='secondary' variant='solid' className='font-mono font-bold'>
                  GET
                </Chip>
                <h3 className='text-2xl font-semibold text-primary font-mono'>/autocomplete</h3>
              </div>
              <p className='text-muted-foreground text-base mb-4'>
                Search supported country names and Nigerian states, LGAs, and verified estates.
              </p>
              <p className='text-base font-semibold mb-1'>Query Parameters:</p>
              <ul className='list-disc list-inside text-base ml-4 mb-4'>
                <li>
                  <Code>q</Code> (string, required): Partial query (e.g. &quot;Ikeja&quot;, &quot;Carlton&quot;).
                </li>
                <li>
                  <Code>country</Code> (string, optional): ISO country code (default: &quot;NG&quot;).
                </li>
                <li>
                  <Code>limit</Code> (number, optional): Maximum suggestions to return (1-20, default: 5).
                </li>
              </ul>

              <p className='text-base font-semibold mb-1'>Success Response (200 OK):</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {autocompleteResponse}
              </Code>
            </section>

            <Divider />

            {/* GET /geography/countries */}
            <section id='geography-countries'>
              <div className='flex items-center gap-3 mb-2'>
                <Chip color='secondary' variant='solid' className='font-mono font-bold'>
                  GET
                </Chip>
                <h3 className='text-2xl font-semibold text-primary font-mono'>/geography/countries</h3>
              </div>
              <p className='text-muted-foreground text-base mb-4'>
                Returns standard ISO 3166-1 alpha-2 country metadata, dial codes, flags, and postal format validation rules.
              </p>
              <p className='text-base font-semibold mb-1'>Success Response (200 OK):</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {countriesResponse}
              </Code>
            </section>

            <Divider />

            {/* GET /geography/states */}
            <section id='geography-states'>
              <div className='flex items-center gap-3 mb-2'>
                <Chip color='secondary' variant='solid' className='font-mono font-bold'>
                  GET
                </Chip>
                <h3 className='text-2xl font-semibold text-primary font-mono'>/geography/states</h3>
              </div>
              <p className='text-muted-foreground text-base mb-4'>
                Lists all 36 Nigerian States plus the Federal Capital Territory (FCT) with official state codes and geopolitical zones.
              </p>
              <p className='text-base font-semibold mb-1'>Success Response (200 OK):</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {statesResponse}
              </Code>
            </section>

            <Divider />

            {/* GET /geography/states/:id/lgas */}
            <section id='geography-lgas'>
              <div className='flex items-center gap-3 mb-2'>
                <Chip color='secondary' variant='solid' className='font-mono font-bold'>
                  GET
                </Chip>
                <h3 className='text-2xl font-semibold text-primary font-mono'>/geography/states/:stateId/lgas</h3>
              </div>
              <p className='text-muted-foreground text-base mb-4'>
                Returns Local Government Areas by state from AddressData's Nigerian geography data.
              </p>
              <p className='text-base font-semibold mb-1'>Success Response (200 OK):</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {lgasResponse}
              </Code>
            </section>

            <Divider />

            {/* GET /estates */}
            <section id='estates-endpoint'>
              <div className='flex items-center gap-3 mb-2'>
                <Chip color='secondary' variant='solid' className='font-mono font-bold'>
                  GET
                </Chip>
                <h3 className='text-2xl font-semibold text-primary font-mono'>/estates</h3>
              </div>
              <p className='text-muted-foreground text-base mb-4'>
                Queries approved gated residential and commercial estates across Nigeria with optional state and LGA filters.
              </p>
              <p className='text-base font-semibold mb-1'>Success Response (200 OK):</p>
              <Code className='text-sm max-w-full block whitespace-pre p-4 rounded-lg bg-[#0F172A] text-slate-50 border border-slate-800 shadow-sm overflow-x-auto'>
                {estatesResponse}
              </Code>
            </section>

            <Divider />

            {/* Error Handling */}
            <section id='error-handling'>
              <h2 className='text-2xl font-semibold mb-3 flex items-center text-primary'>
                <AlertTriangle className='mr-2 h-6 w-6 text-secondary' /> Error Handling &amp; Status Codes
              </h2>
              <p>The API uses standard HTTP response codes:</p>
              <ul className='list-disc list-inside mt-2 space-y-2 text-base ml-4'>
                <li>
                  <Code>200 OK</Code>: Request completed successfully.
                </li>
                <li>
                  <Code>400 Bad Request</Code>: Missing required parameters or malformed JSON payload.
                </li>
                <li>
                  <Code>401 Unauthorized</Code>: Missing, inactive, or invalid API key.
                </li>
                <li>
                  <Code>404 Not Found</Code>: Requested resource does not exist.
                </li>
                <li>
                  <Code>429 Too Many Requests</Code>: Daily free tier quota (100 req/day) exceeded.
                </li>
                <li>
                  <Code>500 Internal Error</Code>: Server error. Please contact developer support.
                </li>
              </ul>
            </section>

            <Divider />

            {/* Support */}
            <section id='support' className='text-center'>
              <h2 className='text-2xl font-semibold mb-4 flex items-center justify-center text-primary'>
                <HelpCircle className='mr-2 h-6 w-6 text-secondary' /> Need Integration Support?
              </h2>
              <p className='text-muted-foreground'>
                Our developer support engineering team is available to assist with custom webhooks, bulk backfills, and enterprise
                deployments.
              </p>
              <Link
                href='/support'
                isBlock
                showAnchorIcon
                color='secondary'
                className='text-lg mt-3 inline-block font-semibold'
              >
                Visit Help &amp; Support
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
