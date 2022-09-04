import { config } from 'config'
import { initializeApp } from 'firebase/app'
import { getPerformance } from 'firebase/performance'

export const app = initializeApp(config.firebaseConfig)
export const perf = getPerformance(app)
