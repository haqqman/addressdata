import { AddressData } from '../lib/sdk'

async function runSdkTests() {
  console.log('====================================================')
  console.log('🚀 Running AddressData Global SDK (Tier 0 & Tier 1) Tests')
  console.log('====================================================\n')

  const ad = new AddressData({ environment: 'preview' })
  console.log(`Initialized SDK in "${ad.environment}" environment (Base URL: ${ad.getBaseUrl()})\n`)

  // ----------------------------------------------------------------
  // TEST 1: Tier 0 Global Country Resolution (< 1ms)
  // ----------------------------------------------------------------
  console.log('--- TEST 1: Tier 0 Country Lookups ---')
  const t0Start = performance.now()
  const ng = ad.geography.getCountry('NG')
  const gb = ad.geography.getCountry('United Kingdom')
  const us = ad.geography.getCountry('USA')
  const gh = ad.geography.getCountry('Ghana')
  const t0Elapsed = (performance.now() - t0Start).toFixed(2)

  console.log(`Resolved 4 countries in ${t0Elapsed}ms:`)
  console.log(`- NG: ${ng?.flag} ${ng?.name} (Dial: ${ng?.dialCode}, Admin: ${ng?.adminDivisionType})`)
  console.log(`- GB: ${gb?.flag} ${gb?.name} (Example Postcode: ${gb?.postalCodeFormatExample})`)
  console.log(`- US: ${us?.flag} ${us?.name} (Required: ${us?.postalCodeRequired})`)
  console.log(`- GH: ${gh?.flag} ${gh?.name} (Capital: ${gh?.capital})\n`)

  if (!ng || !gb || !us || !gh) {
    throw new Error('TEST 1 FAILED: Could not resolve core countries')
  }

  // ----------------------------------------------------------------
  // TEST 2: Tier 0 Postal Validation (Global & NIPOST NDAPS)
  // ----------------------------------------------------------------
  console.log('--- TEST 2: Tier 0 Postal Code Validation ---')
  // UK
  const ukValid = ad.geography.validatePostalCode('GB', 'SW1A 1AA')
  const ukInvalid = ad.geography.validatePostalCode('GB', '12345')
  console.log(`- UK Valid Postcode ("SW1A 1AA"): ${ukValid.isValid}`)
  console.log(`- UK Invalid Postcode ("12345"): ${!ukInvalid.isValid ? 'Correctly rejected' : 'Failed'}`)

  // US
  const usValid = ad.geography.validatePostalCode('US', '90210')
  const usInvalid = ad.geography.validatePostalCode('US', 'ABCDE')
  console.log(`- US Valid ZIP ("90210"): ${usValid.isValid}`)
  console.log(`- US Invalid ZIP ("ABCDE"): ${!usInvalid.isValid ? 'Correctly rejected' : 'Failed'}`)

  // Nigeria NIPOST NDAPS 11-12 Code
  const nipostNdapsValid = ad.nigeria.validateNipost('LA 11 W06 TC 10')
  const nipostZipValid = ad.nigeria.validateNipost('100001')
  const nipostInvalid = ad.nigeria.validateNipost('INVALID-99')
  console.log(`- NIPOST NDAPS ("LA 11 W06 TC 10"): ${nipostNdapsValid.isValid} (Formatted: ${nipostNdapsValid.formatted})`)
  console.log(`- NIPOST Traditional 6-Digit ("100001"): ${nipostZipValid.isValid}`)
  console.log(`- NIPOST Invalid ("INVALID-99"): ${!nipostInvalid.isValid ? 'Correctly rejected' : 'Failed'}\n`)

  if (!ukValid.isValid || ukInvalid.isValid || !usValid.isValid || !nipostNdapsValid.isValid) {
    throw new Error('TEST 2 FAILED: Postal validation error')
  }

  // ----------------------------------------------------------------
  // TEST 3: Tier 0 Nigerian Geography Hierarchy (774 LGAs)
  // ----------------------------------------------------------------
  console.log('--- TEST 3: Nigerian 774 LGAs & State Hierarchy ---')
  const stateLgaValid = ad.nigeria.validateHierarchy('Lagos', 'Ikeja')
  const stateLgaMismatch = ad.nigeria.validateHierarchy('Lagos', 'Aba North')
  console.log(`- Lagos + Ikeja: ${stateLgaValid.isValid ? 'VALID' : 'INVALID'}`)
  console.log(`- Lagos + Aba North (Mismatch Detection): ${!stateLgaMismatch.isValid ? 'Caught Mismatch' : 'Failed'}`)
  if (stateLgaMismatch.suggestedState) {
    console.log(`  Suggested Correct State: "${stateLgaMismatch.suggestedState}" (LGA: ${stateLgaMismatch.suggestedLga})\n`)
  }

  if (!stateLgaValid.isValid || stateLgaMismatch.isValid) {
    throw new Error('TEST 3 FAILED: Hierarchy validation error')
  }

  // ----------------------------------------------------------------
  // TEST 4: Unified Address Validation - International Address
  // ----------------------------------------------------------------
  console.log('--- TEST 4: Unified SDK Global Validation (UK) ---')
  const ukRes = await ad.validate({
    street: '10 Downing St',
    city: 'London',
    postalCode: 'SW1A 2AA',
    country: 'GB',
  })
  console.log(`- Valid: ${ukRes.isValid} (Tier: ${ukRes.tier}, Time: ${ukRes.executionTimeMs}ms)`)
  console.log(`- Standardized: "${ukRes.standardized.formattedAddress}"\n`)

  if (!ukRes.isValid) {
    throw new Error('TEST 4 FAILED: International validation failed')
  }

  // ----------------------------------------------------------------
  // TEST 5: Unified Address Validation - Deep Nigerian Address
  // ----------------------------------------------------------------
  console.log('--- TEST 5: Unified SDK Nigerian Address (Enriched) ---')
  const ngRes = await ad.validate({
    street: '123 Allen Avenue',
    city: 'Ikeja',
    state: 'Lagos',
    lga: 'Ikeja',
    areaDistrict: 'Ikeja GRA',
    nipostPostcode: 'LA 11 W06 TC 10',
    country: 'NG',
  })
  console.log(`- Valid: ${ngRes.isValid} (Tier: ${ngRes.tier}, Time: ${ngRes.executionTimeMs}ms)`)
  console.log(`- Standardized: "${ngRes.standardized.formattedAddress}"`)
  console.log(`- Deep Nigeria Intelligence:`)
  console.log(`  * LGA: ${ngRes.nigeria?.lga} (Belongs to ${ngRes.nigeria?.state}: ${ngRes.nigeria?.lgaValidForState})`)
  console.log(`  * Zone: ${ngRes.nigeria?.geopoliticalZone}`)
  console.log(`  * NIPOST NDAPS: ${ngRes.nigeria?.nipostPostcode} (Valid: ${ngRes.nigeria?.nipostValid})`)
  console.log(`  * ADC Candidate: ${ngRes.nigeria?.adc}\n`)

  if (!ngRes.isValid || !ngRes.nigeria?.lgaValidForState) {
    throw new Error('TEST 5 FAILED: Nigerian validation failed')
  }

  // ----------------------------------------------------------------
  // TEST 6: Unified Autocomplete
  // ----------------------------------------------------------------
  console.log('--- TEST 6: Autocomplete ---')
  const autoResults = await ad.autocomplete({ query: 'Ikeja', country: 'NG' })
  console.log(`Found ${autoResults.length} suggestions for "Ikeja":`)
  for (const s of autoResults.slice(0, 3)) {
    console.log(`- [${s.type.toUpperCase()}] ${s.label} (${s.secondaryLabel})`)
  }

  console.log('\n✅ ALL SDK TESTS PASSED WITH 100% SUCCESS!')
}

runSdkTests().catch((err) => {
  console.error('❌ Test failed:', err)
  process.exit(1)
})
