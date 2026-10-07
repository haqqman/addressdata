import admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { NIGERIAN_STATES } from '../lib/data/nigeria-geography'

/**
 * NIGERIAN GEOGRAPHY SEED SCRIPT
 * Populates Firestore collection `nigerianGeography` with all 36 States + FCT and their 774 LGAs.
 *
 * Usage: bun scripts/seed-geography.ts [.env file]
 */

async function main() {
  console.log('--- Seeding Nigerian Geography (36 States + FCT, 774 LGAs) ---')

  const envFile = process.argv[2] || '.env.local'
  const envPath = path.resolve(process.cwd(), envFile)
  console.log(`Loading environment from: ${envFile}`)
  dotenv.config({ path: envPath })

  let saJson = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!saJson) {
    console.error('Error: FIREBASE_SERVICE_ACCOUNT not found in environment.')
    process.exit(1)
  }

  saJson = saJson.trim()
  if (saJson.startsWith("'") && saJson.endsWith("'")) {
    saJson = saJson.substring(1, saJson.length - 1)
  }

  let serviceAccount: any
  try {
    serviceAccount = JSON.parse(saJson)
    if (serviceAccount.private_key) {
      let pk = serviceAccount.private_key
      pk = pk.split('\\n').join('\n').replace(/\r/g, '')
      const header = '-----BEGIN PRIVATE KEY-----'
      const footer = '-----END PRIVATE KEY-----'
      const startIdx = pk.indexOf(header)
      const endIdx = pk.indexOf(footer)

      if (startIdx !== -1 && endIdx !== -1) {
        let body = pk
          .substring(startIdx + header.length, endIdx)
          .replace(/\s+/g, '')
        while (body.length % 4 !== 0) body += '='
        const lines = body.match(/.{1,64}/g) || []
        serviceAccount.private_key =
          header + '\n' + lines.join('\n') + '\n' + footer + '\n'
      }
    }
  } catch (e: any) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', e.message)
    process.exit(1)
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  const db = admin.firestore()
  const GEOGRAPHY_COLLECTION = 'nigerianGeography'
  const LGAS_SUBCOLLECTION = 'lgas'

  console.log(`Starting seed of ${NIGERIAN_STATES.length} States / FCT...`)

  for (const state of NIGERIAN_STATES) {
    const stateRef = db.collection(GEOGRAPHY_COLLECTION).doc(state.id)
    await stateRef.set(
      {
        name: state.name,
        code: state.code,
        capital: state.capital,
        zone: state.zone,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    console.log(`- Seeded State: ${state.name} (${state.code}) with ${state.lgas.length} LGAs`)

    // Write LGAs in batches
    const batch = db.batch()
    for (const lga of state.lgas) {
      const lgaRef = stateRef.collection(LGAS_SUBCOLLECTION).doc(lga.id)
      batch.set(
        lgaRef,
        {
          name: lga.name,
          stateId: state.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
    }
    await batch.commit()
  }

  console.log('\n✅ Successfully seeded all 36 States + FCT and 774 LGAs into Firestore!')
}

main().catch(console.error)
