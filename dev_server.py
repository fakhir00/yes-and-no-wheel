from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


ROOT = Path(__file__).resolve().parent


class SpaHandler(SimpleHTTPRequestHandler):
  def end_headers(self):
    self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    self.send_header('Pragma', 'no-cache')
    self.send_header('Expires', '0')
    super().end_headers()

  def translate_path(self, path):
    translated = super().translate_path(path)
    rel = Path(translated).resolve()
    try:
      rel.relative_to(ROOT)
      return str(rel)
    except ValueError:
      return str(ROOT)

  def do_GET(self):
    requested = Path(self.translate_path(self.path))

    if requested.exists():
      if requested.is_dir() and (requested / 'index.html').exists():
        return super().do_GET()

      if not requested.is_dir():
        return super().do_GET()

    if requested.is_dir() and (requested / 'index.html').exists():
      return super().do_GET()

    if self.path.startswith('/js/') or self.path.startswith('/images/') or self.path.startswith('/favicon') or self.path.endswith('.css') or self.path.endswith('.xml') or self.path.endswith('.txt'):
      return super().do_GET()

    self.path = '/index.html'
    return super().do_GET()


if __name__ == '__main__':
  os.chdir(ROOT)
  server = ThreadingHTTPServer(('127.0.0.1', 8000), SpaHandler)
  print('Serving SPA at http://127.0.0.1:8000')
  server.serve_forever()
