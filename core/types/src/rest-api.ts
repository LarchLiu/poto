export interface Params {
  key: string
  value: string
}

export type BodyType =
  | 'none'
  | 'form-data'
  | 'x-www-form-urlencoded'
  | 'raw'
  | 'binary'

export type RawBodyType = 'text' | 'json' | 'xml' | 'javascript' | 'html'

export type NoneBody = null

export type XWWWFormURLEncodedBody = Params[]

export type BinaryBody = string

export type FormDataBody = Params[]

export type TextRawBody = string

export type JavaScriptRawBody = string

export type JSONRawBody = string

export type HTMLRawBody = string

export type XMLRawBody = string

export interface RawBody<T extends RawBodyContent> {
  type: RawBodyType
  content: T
}

export type RawBodyContent =
  | TextRawBody
  | JavaScriptRawBody
  | JSONRawBody
  | HTMLRawBody
  | XMLRawBody

export type BodyContent =
  | NoneBody
  | FormDataBody
  | XWWWFormURLEncodedBody
  | BinaryBody
  | RawBody<RawBodyContent>

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RestApiAction<T extends BodyContent> {
  method: ApiMethod
  url: string
  urlParams: Params[]
  headers: Params[]
  cookies: Params[]
  bodyType: BodyType
  body: T
}
