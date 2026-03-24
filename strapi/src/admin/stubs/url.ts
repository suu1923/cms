/**
 * 浏览器端 url stub，提供 Node url 模块的 fileURLToPath/pathToFileURL
 */
export function fileURLToPath(url: URL | string): string {
  const s = typeof url === 'string' ? url : url.href;
  return s.replace(/^file:\/\/\//, '').replace(/^file:\/\//, '');
}
export function pathToFileURL(path: string): URL {
  return new URL('file://' + path);
}
export default { fileURLToPath, pathToFileURL };
