/**
 * 浏览器端 source-map-js stub。
 *
 * Strapi Admin 的某些依赖（如 sanitize-html -> postcss）会在客户端 bundle 中
 * 间接引用 source-map-js。Vite 在浏览器环境会把它 externalize 成仅用于兼容的
 * 占位模块，导致访问 SourceMapConsumer/SourceMapGenerator 直接报错。
 *
 * 这里提供一个“够用就好”的空实现：避免运行时报错。Admin 侧并不依赖 source map
 * 的精确能力。
 */

export class SourceMapConsumer {
  constructor(_rawSourceMap?: unknown) {}
  destroy() {}
  originalPositionFor(_pos: unknown) {
    return { source: null, line: null, column: null, name: null };
  }
  generatedPositionFor(_pos: unknown) {
    return { line: null, column: null, lastColumn: null };
  }
  sourceContentFor(_source: string) {
    return null;
  }
  eachMapping() {}
  static initialize() {}
}

export class SourceMapGenerator {
  constructor(_opts?: unknown) {}
  addMapping() {}
  setSourceContent() {}
  applySourceMap() {}
  toString() {
    return '';
  }
  toJSON() {
    return {};
  }
}

export default { SourceMapConsumer, SourceMapGenerator };

