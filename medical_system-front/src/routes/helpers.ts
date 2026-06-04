export const pathsPublic: { [k: string]: string } = {
  auth: '/auth',
  registration: '/registration',
  welcome: '/welcome',
  resetPassword: '/reset-password',
}

export const pathsPrivate: { [k: string]: string } = {
  home: '/home',
  temperatureSheet: '/temperature-sheet',
  medicalStaffSchedule: '/medical-staff-schedule',
  patientCard: '/patient-card',
  hospitalBeds: '/hospital-beds',
  wardRound: '/ward-round',
  bedsAdmin: '/beds-admin',
  medicines: '/medicines',
  laboratory: '/laboratory',
  patientCabinet: '/patient-cabinet',
}

export const paths: { [k: string]: string } = Object.assign({}, pathsPublic, pathsPrivate)

export const checkPathMatch = (pathname: string, paths: { [k: string]: string }) => {
  let isMatch = false

  const allPaths = Object.keys(paths).map((key) => paths[key])
  const pathFirstSection = pathname.split('/')[1]

  allPaths.forEach((p) => {
    if (p.slice(1) === pathFirstSection) {
      isMatch = true
    }
  })
  return isMatch
}
