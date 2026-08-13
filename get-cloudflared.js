const fs = require('fs');
const https = require('https');

function download(url, dest) {
  https.get(url, res => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Following redirect to:', res.headers.location);
      return download(res.headers.location, dest);
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close(() => console.log('CLOUDFLARED BINARY SUCCESSFULLY DOWNLOADED!'));
    });
  }).on('error', err => console.error(err));
}

download('https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe', 'cloudflared.exe');
