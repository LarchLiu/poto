export enum EvaluationScriptType {
  EXPRESSION = 'EXPRESSION',
  ASYNC_ANONYMOUS_FUNCTION = 'ASYNC_ANONYMOUS_FUNCTION',
}

export const ScriptTemplate = '<<string>>'

export const EvaluationScripts: Record<EvaluationScriptType, string> = {
  [EvaluationScriptType.EXPRESSION]: `
  function closedFunction () {
    const result = ${ScriptTemplate}
    return result;
  }
  closedFunction.call(THIS_CONTEXT)
  `,
  [EvaluationScriptType.ASYNC_ANONYMOUS_FUNCTION]: `
  async function callback (script) {
    const userFunction = script;
    const result = await userFunction?.apply(THIS_CONTEXT, ARGUMENTS);
    return result;
  }
  callback(${ScriptTemplate})
  `,
}

const getScriptType = (isTriggerBased = false): EvaluationScriptType => {
  let scriptType = EvaluationScriptType.EXPRESSION
  if (isTriggerBased)
    scriptType = EvaluationScriptType.ASYNC_ANONYMOUS_FUNCTION

  return scriptType
}

export const getScriptToEval = (
  userScript: string,
  isTriggerBased = false,
): string => {
  const scriptType = getScriptType(isTriggerBased)
  const buffer = EvaluationScripts[scriptType].split(ScriptTemplate)
  return `${buffer[0]}${userScript}${buffer[1]}`
}

