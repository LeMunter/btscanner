import { config } from 'config'
import { initializeApp } from 'firebase/app'
import { getPerformance } from 'firebase/performance'
import ReactGA from 'react-ga'

export const app = initializeApp(config.firebaseConfig)
export const perf = getPerformance(app)

const TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID)
} else {
  console.error('No GA tracking-id')
}
