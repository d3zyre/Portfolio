import { B1Assam } from './sections/B1Assam'
import { B2Hazard } from './sections/B2Hazard'
import { B3Char } from './sections/B3Char'
import { B4Repeating } from './sections/B4Repeating'
import { B5Network } from './sections/B5Network'
import { B6Research } from './sections/B6Research'
import { B7Voices } from './sections/B7Voices'
import { B8Existing } from './sections/B8Existing'
import { B9Direction } from './sections/B9Direction'
import { B10Mesh } from './sections/B10Mesh'
import { B11Constraints } from './sections/B11Constraints'
import { B12Intro } from './sections/B12Intro'
import { B13Onboarding } from './sections/B13Onboarding'
import { B14Pragya } from './sections/B14Pragya'
import { B15Aastha } from './sections/B15Aastha'
import { B16Rohan } from './sections/B16Rohan'
import { B17Domains } from './sections/B17Domains'
import { B18Coordinator } from './sections/B18Coordinator'
import { B19FieldTeam } from './sections/B19FieldTeam'
import { B20Outro } from './sections/B20Outro'

export default function LongForm() {
  return (
    <main className="bg-bg">
      <h1 className="sr-only">ResQ — disaster communication for Assam, a UX case study</h1>
      <B1Assam />
      <B2Hazard />
      <B3Char />
      <B4Repeating />
      <B5Network />
      <B6Research />
      <B7Voices />
      <B8Existing />
      <B9Direction />
      <B10Mesh />
      <B11Constraints />
      <B12Intro />
      <B13Onboarding />
      <B14Pragya />
      <B15Aastha />
      <B16Rohan />
      <B17Domains />
      <B18Coordinator />
      <B19FieldTeam />
      <B20Outro />
    </main>
  )
}
