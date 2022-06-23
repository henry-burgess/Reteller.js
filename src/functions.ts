export const getWidth = (): number => {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export const getHeight = (): number => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}