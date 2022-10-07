import { EVALUATION_TYPE } from './interface'
import { isDynamicString, wrapFunctionCode } from './utils'
import { getDynamicValue } from './dynamicConverter'
import type { Transformer, TransformerAction } from '~/types'

export const evaluateDynamicString = (
  // keyInDataTree: string,
  dynamicString: string,
  dataTree: Record<string, any>,
  evaluationType: EVALUATION_TYPE = EVALUATION_TYPE.TEMPLATE,
) => {
  // const data = dataTree[keyInDataTree]
  // if (!data) return
  const requiresEval = isDynamicString(dynamicString)
  let evalResult
  if (requiresEval) {
    try {
      evalResult = getDynamicValue(dynamicString, dataTree, evaluationType)
    }
    catch (error) {
      evalResult = undefined
      throw error
    }
  }
  else {
    evalResult = dynamicString
  }
  return evalResult
}

export function runTransformer(transformer: Transformer | TransformerAction, rawData: any, rawIndex?: number) {
  let calcResult: any = rawData
  const transString = (transformer as TransformerAction).transformerString
  const trans = typeof transString === 'string' ? { enable: true, rawData: transString } : transformer as Transformer
  if (trans?.enable) {
    const evaluateTransform = wrapFunctionCode(trans.rawData)
    const canEvalString = `{{${evaluateTransform}()}}`
    try {
      calcResult = evaluateDynamicString(canEvalString, {
        index: rawIndex,
        data: rawData,
      })
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }
  return calcResult
}
