export const pathReplace = (path: string) => {
  return path.replace('/home/ya/mapdata', window.ipconfig.ip + ':33033/gens')
}
