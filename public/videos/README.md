# Product videos

Put `.mp4` (H.264) files here and set the product's `videoUrl` in
`src/lib/products.ts`, e.g. `videoUrl: "/videos/bounce-pro-ball.mp4"`.
The video plays muted on loop under the 3D viewer on that product's page.

Optional extras (see the Bounce Pro ball entry for an example):

- `videoWebmUrl`: a WebM copy for browsers without H.264 support. Make one with
  `ffmpeg -i in.mp4 -c:v libvpx-vp9 -b:v 0 -crf 36 -c:a libopus out.webm`
- `videoPoster`: a still frame shown before playback. Make one with
  `ffmpeg -ss 4 -i in.mp4 -frames:v 1 poster.jpg`
