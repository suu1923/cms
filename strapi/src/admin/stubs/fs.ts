/**
 * 浏览器端 fs stub，避免 admin 打包时引用 Node 的 fs
 */
export function existsSync(): boolean {
  return false;
}
export function readFileSync(): string {
  return '';
}
export default { existsSync, readFileSync };
