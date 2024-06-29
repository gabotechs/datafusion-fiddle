use datafusion::arrow::error::ArrowError;
use datafusion::arrow::util::display::{ArrayFormatter, FormatOptions};
use datafusion::prelude::SessionContext;
use serde::{Deserialize, Serialize};
use serde_json::json;
use vercel_runtime::{run, Body, Error, Request, RequestPayloadExt, Response, StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

#[derive(Serialize, Deserialize, Default, Debug)]
struct SqlRequest {
    stmts: Vec<String>,
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let req = match req.payload::<SqlRequest>()? {
        Some(req) => req,
        None => return throw_error("No sql request was passed", None, StatusCode::BAD_REQUEST),
    };

    let res = match execute_statements(req.stmts).await {
        Ok(res) => res,
        Err(err) => return throw_error(&err.to_string(), Some(Box::new(err)), StatusCode::BAD_REQUEST),
    };

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(json!(res).to_string().into())?)
}

pub fn throw_error(
    message: &str,
    error: Option<Error>,
    status_code: StatusCode,
) -> Result<Response<Body>, Error> {
    if let Some(error) = error {
        eprintln!("error: {error}");
    }

    Ok(Response::builder()
        .status(status_code)
        .header("Content-Type", "application/json")
        .body(json!({ "message": message }).to_string().into())?)
}

#[derive(Serialize, Deserialize, Default, Debug)]
struct SqlResult {
    columns: Vec<(String, String)>,
    rows: Vec<Vec<String>>,
}

async fn execute_statements(stmts: Vec<String>) -> datafusion::error::Result<SqlResult> {
    let options = FormatOptions::default().with_display_error(true);
    let ctx = SessionContext::new();

    if stmts.is_empty() {
        return Ok(SqlResult::default());
    }

    for i in 0..stmts.len() - 1 {
        ctx.sql(stmts.get(i).unwrap()).await?.collect().await?;
    }
    let df = ctx.sql(stmts.last().unwrap()).await?;

    let record_batches = df.collect().await?;

    let mut columns: Vec<(String, String)> = vec![];
    let mut rows: Vec<Vec<String>> = vec![];
    for record_batch in record_batches {
        if columns.is_empty() {
            columns = record_batch
                .schema()
                .fields
                .iter()
                .map(|e| (e.name().to_string(), e.data_type().to_string()))
                .collect()
        }

        let per_column_formatters = record_batch
            .columns()
            .iter()
            .map(|c| ArrayFormatter::try_new(c.as_ref(), &options))
            .collect::<Result<Vec<_>, ArrowError>>()?;

        for i in 0..record_batch.num_rows() {
            let mut row: Vec<String> = vec![];
            for formatter in &per_column_formatters {
                row.push(formatter.value(i).to_string());
            }
            rows.push(row);
        }
    }

    Ok(SqlResult { columns, rows })
}

#[cfg(test)]
mod tests {
    use crate::execute_statements;

    #[tokio::test]
    async fn test_handler() -> datafusion::error::Result<()> {
        let result = execute_statements(vec![
            "CREATE TABLE book (str text)".to_string(),
            "INSERT INTO book (str) VALUES ('foo')".to_string(),
            "SELECT * FROM book".to_string(),
        ])
        .await?;

        assert_eq!(result.columns.len(), 1);
        assert_eq!(
            result.columns.first().unwrap(),
            &("str".to_string(), "Utf8".to_string())
        );
        assert_eq!(result.rows.len(), 1);
        assert_eq!(result.rows.first().unwrap().first().unwrap(), "foo");
        Ok(())
    }
}
