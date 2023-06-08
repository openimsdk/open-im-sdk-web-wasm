export function logBoxStyleValue(backgroundColor?: string, color?: string) {
  return `font-size:14px; background:${backgroundColor ?? '#ffffff'}; color:${
    color ?? '#000000'
  }; border-radius:4px; padding-inline:4px;`;
}
