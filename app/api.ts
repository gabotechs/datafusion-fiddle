export interface SqlRequest {
  stmts: string[]
}

export interface SqlResponse {
  columns: Array<[string, string]>,
  rows: Array<Array<string>>,
}

export async function executeStatements (stmts: string[]): Promise<SqlResponse> {
  const req: SqlRequest = {
    stmts
  }
  const res = await fetch(
    '/api/main',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(req),
    }
  )
  if (res.status === 200) {
    return await res.json()
  } else if (res.status === 400) {
    const { message } = await res.json()
    throw new Error(message)
  } else {
    const msg = await res.text()
    throw new Error(`unexpected status ${res.status}: ${msg}`)
  }
}
