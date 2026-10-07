import {
  NIGERIAN_STATES,
  getAllStates,
  getStateById,
  getLgasByStateId,
  findStateByName,
  findLgaByName,
  type NigerianState,
  type NigerianLGA,
  type GeopoliticalZone,
} from '@/lib/data/nigeria-geography'

export interface NigeriaHierarchyValidation {
  isValid: boolean
  matchedState?: NigerianState
  matchedLga?: NigerianLGA
  suggestedState?: string
  suggestedLga?: string
  error?: string
}

/**
 * Tier 0: Deep in-memory Nigerian administrative geography engine.
 * Covers all 36 States + FCT and all 774 LGAs with zero network overhead (< 1ms).
 */
export class NigeriaGeographyEngine {
  /**
   * Returns all 36 states + FCT without children (lightweight for dropdowns).
   */
  static listStates() {
    return getAllStates()
  }

  /**
   * Resolves a state by ID, 2-letter postal code, or full name.
   */
  static findState(query: string): NigerianState | undefined {
    return getStateById(query) || findStateByName(query)
  }

  /**
   * Returns all LGAs for a given state.
   */
  static getLgas(stateQuery: string): NigerianLGA[] {
    const state = this.findState(stateQuery)
    return state ? state.lgas : []
  }

  /**
   * Strictly validates whether a given LGA belongs to the given State.
   * If mismatched, attempts to locate the LGA in another state to provide actionable correction.
   */
  static validateHierarchy(
    stateQuery: string,
    lgaQuery: string,
  ): NigeriaHierarchyValidation {
    if (!stateQuery) {
      return { isValid: false, error: 'State is required for Nigerian address verification.' }
    }
    if (!lgaQuery) {
      return { isValid: false, error: 'LGA is required for Nigerian address verification.' }
    }

    const state = this.findState(stateQuery)
    if (!state) {
      return {
        isValid: false,
        error: `"${stateQuery}" is not a recognized Nigerian state or territory.`,
      }
    }

    const lga = findLgaByName(state.id, lgaQuery)
    if (lga) {
      return {
        isValid: true,
        matchedState: state,
        matchedLga: lga,
      }
    }

    // Cross-search across other states to detect if user selected the wrong state
    const normalizedLga = lgaQuery.trim().toLowerCase()
    for (const otherState of NIGERIAN_STATES) {
      const match = otherState.lgas.find(
        (l) => l.name.toLowerCase() === normalizedLga || l.id === normalizedLga,
      )
      if (match) {
        return {
          isValid: false,
          matchedState: state,
          suggestedState: otherState.name,
          suggestedLga: match.name,
          error: `LGA "${lgaQuery}" does not belong to ${state.name}. Did you mean ${otherState.name}?`,
        }
      }
    }

    return {
      isValid: false,
      matchedState: state,
      error: `"${lgaQuery}" is not a recognized LGA in ${state.name}.`,
    }
  }

  /**
   * Fast prefix and substring autocomplete across Nigerian States and LGAs.
   */
  static search(query: string, limit = 10) {
    if (!query) return []
    const q = query.trim().toLowerCase()
    const results: Array<{
      type: 'state' | 'lga'
      id: string
      name: string
      stateName?: string
      stateCode?: string
      zone?: GeopoliticalZone
    }> = []

    // 1. Search states
    for (const state of NIGERIAN_STATES) {
      if (state.name.toLowerCase().includes(q) || state.code.toLowerCase() === q) {
        results.push({
          type: 'state',
          id: state.id,
          name: state.name,
          stateCode: state.code,
          zone: state.zone,
        })
        if (results.length >= limit) return results
      }
    }

    // 2. Search LGAs
    for (const state of NIGERIAN_STATES) {
      for (const lga of state.lgas) {
        if (lga.name.toLowerCase().includes(q)) {
          results.push({
            type: 'lga',
            id: lga.id,
            name: lga.name,
            stateName: state.name,
            stateCode: state.code,
            zone: state.zone,
          })
          if (results.length >= limit) return results
        }
      }
    }

    return results
  }
}
