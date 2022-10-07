import { getScriptToEval } from './scriptTemplate'
import { createGlobalData } from './utils'

export function evalScript(
  script: string,
  dataTree: Record<string, any>,
  isTriggerBased: boolean,
): any {
  return (function () {
    let result: any

    const GlobalData = createGlobalData(dataTree)

    for (const entity in GlobalData) {
      // @ts-expect-error: No types available
      self[entity] = GlobalData[entity]
    }

    const userScript = getScriptToEval(script, isTriggerBased)

    try {
      // eslint-disable-next-line no-eval
      result = eval(userScript)
    }
    // eslint-disable-next-line no-useless-catch
    catch (error) {
      throw error
    }
    finally {
      for (const entity in GlobalData) {
        // @ts-expect-error: No types available
        delete self[entity]
      }
    }
    return result
  })()
}
