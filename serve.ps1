$listener = New-Object System.Net.HttpListener
$prefix = 'http://localhost:5500/'
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host ("Serving static files from " + (Get-Location) + " at " + $prefix)

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = $ctx.Request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
    $full = Join-Path (Get-Location) $rel

    if (Test-Path $full) {
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ctx.Response.StatusCode = 200
      switch -Regex ($full) {
        '.*\.html$' { $ctx.Response.ContentType = 'text/html; charset=utf-8'; break }
        '.*\.css$'  { $ctx.Response.ContentType = 'text/css; charset=utf-8'; break }
        '.*\.js$'   { $ctx.Response.ContentType = 'application/javascript; charset=utf-8'; break }
        '.*\.png$'  { $ctx.Response.ContentType = 'image/png'; break }
        '.*\.jpg$'  { $ctx.Response.ContentType = 'image/jpeg'; break }
        '.*\.jpeg$' { $ctx.Response.ContentType = 'image/jpeg'; break }
        '.*\.gif$'  { $ctx.Response.ContentType = 'image/gif'; break }
        Default      { $ctx.Response.ContentType = 'application/octet-stream' }
      }
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes('<h1>404 Not Found</h1>')
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }

    $ctx.Response.OutputStream.Close()
  } catch {
    Write-Host ("Error: " + $_.Exception.Message)
  }
}