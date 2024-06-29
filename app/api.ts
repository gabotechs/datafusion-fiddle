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
      body: JSON.stringify(req)
    }
  )
  return await res.json()
}
