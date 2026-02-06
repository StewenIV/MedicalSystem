import WelcomeScreen from "pages/WelcomeScreen"

export const pathsPublic: { [k: string]: string } = {
  auth: '/auth',
  registration: '/registration',
  WelcomeScreen: '/welcome'
}

export const pathsPrivate: { [k: string]: string } = {
  home: '/home'
}

export const paths: { [k: string]: string } = Object.assign(
  {},
  pathsPublic,
  pathsPrivate
)


export const checkPathMatch = (
  pathname: string,
  paths: { [k: string]: string }
) => {
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