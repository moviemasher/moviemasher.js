The [@moviemasher/server-express](https://www.npmjs.com/package/@moviemasher/server-express)
package builds upon the core [@moviemasher/moviemasher.js](https://www.npmjs.com/package/@moviemasher/moviemasher.js) package to provide an [ExpressJS](https://expressjs.com) server API capable of video encoding and streaming, as well as managing media and its metadata. 


The server package is optimized to work with the [@moviemasher/client-react](https://www.npmjs.com/package/@moviemasher/client-react) package, but this is not a requirement. 
It defines several [[Server]] classes, each handling a specific set of functionality:

- [[ApiServer]]: handles routing of requests to other servers
- [[DataServer]]: handles storage of JSON formatted data
- [[FileServer]]: handles storage of binary media files
- [[RenderingServer]]: handles creation of video files
- [[StreamingServer]]: handles a streaming session
- [[WebServer]]: delivers static files

The interface between client and server is highly structured, with both requests and responses consisting of strongly typed JSON objects that effectively constitute the API between them. Communication is funneled through the [[ApiClient]] component on the client and the [[ApiServer]] class on the server.

## Demos

Since the [Demo](https://moviemasher.com/docs/demo/index.html) only includes the client-side components of the system, the first step is typically to launch a fully functional one either in the cloud or locally to test out the server-side functionality. 

<!-- MAGIC:START (COLORSVG:replacements=black&src=../svg/aws.svg) -->
<svg width="640" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 48" class='diagram'>
<path d="M 22.37 17.24 C 22.37 18.21 22.47 19.01 22.66 19.59 C 22.87 20.17 23.13 20.80 23.50 21.49 C 23.63 21.70 23.69 21.91 23.69 22.10 C 23.69 22.36 23.53 22.62 23.19 22.89 L 21.52 24.00 C 21.29 24.15 21.05 24.23 20.84 24.23 C 20.57 24.23 20.31 24.10 20.04 23.86 C 19.68 23.47 19.36 23.05 19.09 22.62 C 18.83 22.17 18.57 21.67 18.28 21.07 C 16.22 23.49 13.63 24.71 10.51 24.71 C 8.30 24.71 6.53 24.08 5.24 22.81 C 3.94 21.54 3.28 19.85 3.28 17.74 C 3.28 15.50 4.07 13.67 5.68 12.30 C 7.29 10.93 9.43 10.24 12.15 10.24 C 13.05 10.24 13.97 10.32 14.95 10.45 C 15.93 10.59 16.93 10.80 17.99 11.03 L 17.99 9.11 C 17.99 7.10 17.56 5.70 16.74 4.88 C 15.90 4.07 14.47 3.67 12.44 3.67 C 11.52 3.67 10.57 3.77 9.59 4.01 C 8.61 4.25 7.66 4.54 6.74 4.91 C 6.32 5.09 6.00 5.20 5.82 5.25 C 5.63 5.31 5.50 5.33 5.39 5.33 C 5.02 5.33 4.84 5.07 4.84 4.51 L 4.84 3.22 C 4.84 2.80 4.89 2.48 5.02 2.30 C 5.16 2.11 5.39 1.93 5.76 1.74 C 6.69 1.27 7.80 0.87 9.09 0.55 C 10.38 0.21 11.76 0.05 13.21 0.05 C 16.35 0.05 18.65 0.77 20.12 2.19 C 21.58 3.62 22.31 5.78 22.31 8.69 L 22.31 17.24 Z M 11.65 21.25 C 12.52 21.25 13.42 21.09 14.37 20.78 C 15.32 20.46 16.16 19.88 16.88 19.09 C 17.30 18.58 17.62 18.03 17.77 17.40 C 17.93 16.76 18.04 16.00 18.04 15.10 L 18.04 13.99 C 17.27 13.81 16.45 13.65 15.61 13.54 C 14.77 13.44 13.95 13.38 13.13 13.38 C 11.36 13.38 10.07 13.73 9.20 14.44 C 8.32 15.15 7.90 16.16 7.90 17.48 C 7.90 18.72 8.22 19.64 8.88 20.27 C 9.51 20.93 10.44 21.25 11.65 21.25 Z M 32.85 24.10 C 32.37 24.10 32.06 24.02 31.84 23.84 C 31.63 23.68 31.45 23.31 31.29 22.81 L 25.09 2.40 C 24.93 1.87 24.85 1.53 24.85 1.35 C 24.85 0.92 25.06 0.69 25.48 0.69 L 28.07 0.69 C 28.57 0.69 28.91 0.77 29.10 0.95 C 29.31 1.11 29.47 1.48 29.63 1.98 L 34.06 19.46 L 38.18 1.98 C 38.31 1.45 38.47 1.11 38.68 0.95 C 38.89 0.79 39.26 0.69 39.74 0.69 L 41.85 0.69 C 42.35 0.69 42.69 0.77 42.91 0.95 C 43.12 1.11 43.30 1.48 43.41 1.98 L 47.58 19.67 L 52.14 1.98 C 52.30 1.45 52.49 1.11 52.67 0.95 C 52.88 0.79 53.23 0.69 53.70 0.69 L 56.16 0.69 C 56.58 0.69 56.82 0.90 56.82 1.35 C 56.82 1.48 56.79 1.61 56.76 1.77 C 56.74 1.93 56.69 2.14 56.58 2.43 L 50.22 22.83 C 50.06 23.36 49.87 23.71 49.66 23.86 C 49.45 24.02 49.11 24.13 48.66 24.13 L 46.39 24.13 C 45.89 24.13 45.55 24.05 45.33 23.86 C 45.12 23.68 44.94 23.34 44.83 22.81 L 40.74 5.78 L 36.68 22.78 C 36.54 23.31 36.39 23.65 36.17 23.84 C 35.96 24.02 35.59 24.10 35.12 24.10 L 32.85 24.10 Z M 66.77 24.81 C 65.40 24.81 64.02 24.66 62.70 24.34 C 61.38 24.02 60.35 23.68 59.67 23.28 C 59.25 23.05 58.96 22.78 58.85 22.54 C 58.74 22.31 58.69 22.04 58.69 21.80 L 58.69 20.46 C 58.69 19.90 58.90 19.64 59.30 19.64 C 59.46 19.64 59.62 19.67 59.77 19.72 C 59.93 19.77 60.17 19.88 60.43 19.98 C 61.33 20.38 62.31 20.70 63.34 20.91 C 64.39 21.12 65.42 21.22 66.48 21.22 C 68.14 21.22 69.44 20.93 70.33 20.35 C 71.23 19.77 71.71 18.93 71.71 17.85 C 71.71 17.11 71.47 16.50 70.99 16.00 C 70.52 15.50 69.62 15.05 68.33 14.62 L 64.50 13.44 C 62.57 12.83 61.15 11.93 60.28 10.74 C 59.40 9.58 58.96 8.29 58.96 6.92 C 58.96 5.81 59.19 4.83 59.67 3.99 C 60.14 3.14 60.78 2.40 61.57 1.82 C 62.36 1.21 63.26 0.77 64.31 0.45 C 65.37 0.13 66.48 0.00 67.64 0.00 C 68.22 0.00 68.83 0.03 69.41 0.11 C 70.02 0.18 70.57 0.29 71.13 0.40 C 71.65 0.53 72.15 0.66 72.63 0.82 C 73.11 0.98 73.47 1.14 73.74 1.29 C 74.11 1.50 74.37 1.72 74.53 1.95 C 74.69 2.16 74.77 2.46 74.77 2.82 L 74.77 4.07 C 74.77 4.62 74.56 4.91 74.16 4.91 C 73.95 4.91 73.61 4.80 73.16 4.59 C 71.65 3.91 69.96 3.56 68.09 3.56 C 66.58 3.56 65.40 3.80 64.58 4.30 C 63.76 4.80 63.34 5.57 63.34 6.65 C 63.34 7.39 63.60 8.03 64.13 8.53 C 64.66 9.03 65.63 9.53 67.03 9.98 L 70.78 11.17 C 72.68 11.77 74.06 12.62 74.87 13.70 C 75.69 14.78 76.09 16.02 76.09 17.40 C 76.09 18.53 75.85 19.56 75.40 20.46 C 74.93 21.36 74.29 22.15 73.47 22.78 C 72.66 23.44 71.68 23.92 70.54 24.26 C 69.36 24.63 68.12 24.81 66.77 24.81 Z M 66.77 24.81" stroke="none" fill="currentColor"  />
<path d="M 71.76 37.64 C 63.07 44.06 50.46 47.46 39.61 47.46 C 24.40 47.46 10.70 41.84 0.35 32.50 C -0.47 31.76 0.27 30.75 1.25 31.33 C 12.44 37.83 26.25 41.76 40.53 41.76 C 50.16 41.76 60.75 39.76 70.49 35.64 C 71.94 34.98 73.18 36.59 71.76 37.64 Z M 71.76 37.64" stroke="none" fill="currentColor"  />
<path d="M 75.38 33.53 C 74.27 32.10 68.04 32.84 65.21 33.18 C 64.37 33.29 64.24 32.55 65.00 31.99 C 69.96 28.51 78.12 29.51 79.07 30.67 C 80.02 31.86 78.81 40.02 74.16 43.93 C 73.45 44.53 72.76 44.22 73.08 43.43 C 74.13 40.81 76.48 34.92 75.38 33.53 Z M 75.38 33.53" stroke="none" fill="currentColor"  />
</svg>
<!-- MAGIC:END -->

Non-developers or anyone with an Amazon account may find launching Movie Masher within their
[AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-vj7erupihhxv6) to be the simplest option. The image available there can be used to launch an EC2 instance of any size, to which you have full access. You can even make your own images based on it, including any custom changes or additions.

<!-- MAGIC:START (COLORSVG:replacements=black&src=../svg/docker.svg) -->
<svg width="640" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 0 640 48" class='diagram'>
<path d="M 13.12 38.68 C 11.26 38.68 9.57 37.12 9.57 35.22 C 9.57 33.32 11.09 31.77 13.12 31.77 C 15.15 31.77 16.67 33.32 16.67 35.22 C 16.67 37.12 14.98 38.68 13.12 38.68 Z M 56.74 19.86 C 56.40 17.09 54.71 14.85 52.51 13.12 L 51.67 12.43 L 50.99 13.29 C 49.64 14.85 49.13 17.61 49.30 19.68 C 49.47 21.24 49.98 22.79 50.82 24.00 C 50.15 24.35 49.30 24.69 48.62 25.04 C 47.10 25.55 45.58 25.73 44.06 25.73 L 0.27 25.73 L 0.10 26.76 C -0.24 30.04 0.27 33.50 1.62 36.60 L 2.30 37.81 L 2.30 37.99 C 6.36 44.89 13.63 48.00 21.57 48.00 C 36.79 48.00 49.30 41.27 55.22 26.76 C 59.11 26.94 63.00 25.90 64.86 22.10 L 65.36 21.24 L 64.52 20.72 C 62.32 19.34 59.28 19.17 56.74 19.86 Z M 34.93 17.09 L 28.34 17.09 L 28.34 23.83 L 34.93 23.83 L 34.93 17.09 Z M 34.93 8.63 L 28.34 8.63 L 28.34 15.37 L 34.93 15.37 L 34.93 8.63 Z M 34.93 -0.00 L 28.34 -0.00 L 28.34 6.73 L 34.93 6.73 L 34.93 -0.00 Z M 43.05 17.09 L 36.45 17.09 L 36.45 23.83 L 43.05 23.83 L 43.05 17.09 Z M 18.53 17.09 L 11.94 17.09 L 11.94 23.83 L 18.53 23.83 L 18.53 17.09 Z M 26.81 17.09 L 20.22 17.09 L 20.22 23.83 L 26.81 23.83 L 26.81 17.09 Z M 10.41 17.09 L 3.82 17.09 L 3.82 23.83 L 10.41 23.83 L 10.41 17.09 Z M 26.81 8.63 L 20.22 8.63 L 20.22 15.37 L 26.81 15.37 L 26.81 8.63 Z M 18.53 8.63 L 11.94 8.63 L 11.94 15.37 L 18.53 15.37 L 18.53 8.63 Z M 18.53 8.63" stroke="none" fill="currentColor"  />
<path d="M 170.69 34.53 C 173.57 31.94 176.44 29.53 179.32 26.94 C 180.33 26.07 181.34 25.21 182.36 24.17 C 181.51 23.14 180.33 22.45 179.15 21.93 C 176.95 21.06 174.75 21.41 172.55 22.62 C 169.85 24.17 168.66 26.76 168.83 29.87 C 168.83 31.08 169.17 32.29 169.85 33.32 C 170.36 33.84 170.52 34.19 170.69 34.53 M 174.07 36.95 C 175.43 37.47 177.12 37.47 178.64 37.12 C 179.32 36.78 181.34 35.91 182.02 36.09 L 182.36 36.09 C 182.87 36.26 183.20 36.60 183.37 37.12 C 183.88 38.16 183.71 39.19 182.70 39.71 L 182.36 39.88 C 178.64 42.13 174.75 41.78 171.03 39.71 C 169.34 38.68 167.99 37.29 166.97 35.57 L 166.80 35.22 C 164.44 31.08 164.78 26.59 167.48 22.62 C 168.33 21.24 169.68 20.20 171.03 19.34 L 171.54 18.99 C 175.09 16.92 178.81 17.09 182.36 18.82 C 184.22 19.86 185.91 21.24 186.92 23.14 L 187.09 23.48 C 187.94 24.86 186.92 26.07 185.74 26.94 L 182.19 30.04 C 179.15 32.46 176.61 34.71 174.07 36.95 Z M 201.63 17.96 L 201.97 17.96 C 203.15 17.96 204.00 18.82 204.00 20.03 C 204.00 21.76 202.48 22.10 201.13 22.10 C 199.44 22.10 197.74 23.14 196.56 24.35 C 195.04 25.90 194.36 27.80 194.36 29.87 L 194.36 39.54 C 194.36 40.58 193.69 41.61 192.50 41.61 L 192.17 41.61 C 190.98 41.61 190.31 40.75 190.31 39.54 L 190.31 29.35 C 190.31 25.38 192.17 22.27 195.21 20.03 C 197.41 18.65 199.44 17.96 201.63 17.96 Z M 153.28 24.69 L 157.84 20.03 C 158.35 19.68 159.87 17.78 160.55 17.78 L 161.23 17.78 C 162.07 17.96 162.75 18.47 162.75 19.51 L 162.75 19.86 C 162.75 20.55 161.90 21.24 161.56 21.76 C 160.72 22.79 159.70 23.65 158.86 24.69 L 154.12 29.53 L 160.21 35.74 L 161.90 37.47 L 162.58 38.16 C 162.75 38.50 162.92 38.68 162.92 39.02 L 162.92 39.54 C 162.75 40.40 162.07 41.09 161.23 41.09 L 160.89 41.09 C 160.21 41.09 159.53 40.40 159.03 39.88 C 158.18 39.02 157.17 38.16 156.32 37.12 L 153.28 34.19 L 153.28 39.02 C 153.28 40.06 152.60 41.09 151.42 41.09 L 151.08 41.09 C 149.90 41.09 149.22 40.23 149.22 39.02 L 149.22 12.43 C 149.22 11.40 149.90 10.53 151.08 10.53 L 151.42 10.53 C 152.60 10.53 153.28 11.40 153.28 12.43 L 153.28 24.69 Z M 140.77 22.10 C 140.26 21.76 139.08 21.76 138.40 21.76 C 135.19 21.58 132.82 23.48 131.47 26.42 C 130.96 27.45 130.79 28.49 130.79 29.70 C 130.79 33.15 132.48 35.57 135.53 36.95 C 136.54 37.47 138.06 37.64 139.25 37.64 C 140.26 37.64 141.78 36.95 142.63 36.60 L 143.47 36.60 C 144.32 36.78 144.99 37.29 144.99 38.33 L 144.99 38.68 C 144.99 41.09 140.60 41.61 139.08 41.78 C 133.33 42.13 128.93 38.85 127.24 33.32 C 126.90 32.29 126.90 31.42 126.90 30.39 L 126.90 29.53 C 126.90 25.21 128.93 21.76 132.65 19.68 C 134.34 18.65 136.20 18.13 138.23 18.13 L 139.08 18.13 C 141.11 18.13 143.13 18.65 144.83 19.86 L 144.99 20.03 L 145.16 20.20 C 145.33 20.55 145.50 20.89 145.50 21.24 L 145.50 21.58 C 145.50 22.62 144.83 23.14 143.81 23.31 L 143.64 23.31 C 142.46 22.96 141.11 22.27 140.77 22.10 Z M 105.26 29.53 C 105.26 32.46 106.78 34.71 109.15 36.26 C 110.34 36.95 111.69 37.29 113.04 37.29 C 115.91 37.29 118.11 35.74 119.63 33.32 C 120.31 32.12 120.65 30.73 120.65 29.35 C 120.65 26.59 119.30 24.35 117.10 22.79 C 115.91 21.93 114.39 21.58 113.04 21.58 C 109.83 21.58 107.46 23.31 106.11 26.24 C 105.26 27.45 105.26 28.49 105.26 29.53 Z M 112.36 17.78 L 112.87 17.78 C 117.44 17.78 120.82 20.03 123.02 24.00 C 123.86 25.55 124.37 27.28 124.37 29.18 L 124.37 30.04 C 124.37 34.36 122.34 37.81 118.62 39.88 C 116.93 40.92 115.07 41.44 113.04 41.44 L 112.19 41.44 C 107.97 41.44 104.59 39.37 102.56 35.57 C 101.54 33.84 101.04 31.94 101.04 29.87 L 101.04 29.01 C 101.04 24.69 103.07 21.24 106.78 19.17 C 108.64 18.30 110.34 17.78 112.36 17.78 Z M 79.56 29.53 C 79.56 32.63 81.09 35.05 83.79 36.43 C 84.81 36.95 85.99 37.29 87.34 37.29 C 90.38 37.29 92.58 35.91 94.10 33.32 C 94.78 32.12 95.12 30.73 95.12 29.35 C 95.12 26.59 93.94 24.52 91.74 22.96 C 90.38 22.10 89.03 21.58 87.34 21.58 C 84.13 21.58 81.76 23.31 80.41 26.24 C 79.90 27.45 79.56 28.49 79.56 29.53 Z M 95.12 20.72 L 95.12 12.26 C 95.12 11.22 95.80 10.19 96.98 10.19 L 97.32 10.19 C 98.50 10.19 99.18 11.05 99.18 12.26 L 99.18 30.04 C 99.18 34.36 97.15 37.81 93.43 39.88 C 91.74 40.92 89.88 41.44 87.85 41.44 L 87.00 41.44 C 82.78 41.44 79.40 39.37 77.37 35.57 C 76.35 33.84 75.84 31.94 75.84 29.87 L 75.84 29.01 C 75.84 24.69 77.87 21.24 81.59 19.17 C 83.28 18.13 85.14 17.61 87.17 17.61 L 88.02 17.61 C 90.55 17.78 93.09 18.82 95.12 20.72 Z M 95.12 20.72" stroke="none" fill="currentColor"  />
</svg>
<!-- MAGIC:END -->

Developers familar with Docker may want to launch the image available on
[DockerHub](https://hub.docker.com/r/moviemasher/moviemasher.js/), either locally or within a cloud-based container service. This option provides the same ability to access the instance and build atop the image. 


Running the server locally is difficult because it requires certain FFmpeg features that don't come in the default binary supplied by fluent-ffmpeg. Supplying cross-platform binaries through the mechanisms that NPM provides is beyond the scope of Movie Masher since only LINUX is supported by the server at this juncture. Hence, Docker is used during development and testing to provide developers with a standard LINUX environment. 

That said, it's still possible to run the server on other platforms if you've got a proper build of FFmpeg. Here's an example ExpressJS application from _standalone/src/server.js_ that launches the server on port 8572:


<fieldset>

<legend>server.js</legend>

```javascript
const MovieMasherServer = require("@moviemasher/server-express")

const { Host } = MovieMasherServer
const options = { 
  port: 8572, host: '0.0.0.0', 
  api: { authentication: { type: 'basic' } } 
}
const host = new Host(options)
host.start()
```
</fieldset>

You should be able to switch the port to 8570 and execute this script by whatever means you typically launch ExpressJS applications. Even without a custom FFmpeg build you should be able do everything short of rendering video files. 

If you already have a server application that you're trying to incorporate Movie Masher into, you might find it easier to just point the client there (as described in the 
[Client Developer Guide](https://moviemasher.com/docs/ClientDeveloper.html)) 
and then add support for the APIs individually. From the initial request you can return an [ApiServersResponse](https://moviemasher.com/docs/interface/ApiServersResponse.html) that selectively enables the other APIs, potentially overriding their endpoints to point to other parts of your application. 


<!-- MAGIC:START (FILEMD:src=../snippet/example-server-cjs.md&stripMagic=true) -->
## CJS Server Example
The source code is available in CommonJS format for direct use in NodeJS, or as TypScript for rebundling with tools like [rollup.js](https://rollupjs.org/).

### Installation 

The following shell command installs the server and core libraries to your NPM project,
saving the former to the `dependencies` array in your **package.json** file.

```shell
npm install @moviemasher/server-express --save
```
Alternatively, if you're wanting to build your own server you can just install and build off the [core library](https://www.npmjs.com/package/@moviemasher/moviemasher.js) instead.

### _Please note_ 
This does not install a client implementation that interacts with this package. Learn more about how the codebase is structured in the
[Architecture Overview](https://moviemasher.com/docs/Architecture.html).

### Inclusion 

<fieldset>

<legend>server.ts</legend>


```ts
import { Host, HostDefaultOptions } from '@moviemasher/server-express'
const host = new Host(HostDefaultOptions())
host.start()
```
</fieldset>

In this example we're using the [[Host]] class to construct all the [[Server]] instances, using arguments provided by the [[HostDefaultOptions]] function. 


We pass this function a parsed JSON file with the following structure:

# TODO: explain Environment...
In the configuration we are setting the preview dimensions to their default for demonstration purposes. The server will pass these to the client and the client will apply them, but only after the CSS is applied so a resize will be visible if they differ. Preview dimensions should be overridden either in the client, or better still, in the CSS. If the defaults are overidden there they should be here too, since the client does NOT pass them to the server. The rendering server uses them to optimally size previews of uploaded video and images.

We are also setting the output dimensions here, which are used as default values for both the rendering and streaming servers. They should always be an even multiple of the preview dimensions - in this case it's a multiple of four. Using different aspect ratios is actually supported, but then the preview in the client will not match the output of these servers.

<!-- MAGIC:END -->


## API Server 

The [[ApiServer]] provides a high-level routing mechanism to other servers, through two endpoints:

<!-- MAGIC:START (API:include=api) -->
{"include":"api"}
<!-- MAGIC:END -->

The `/api/servers` endpoint is called initially to determine which other servers are enabled, and retrieve any client configuration for them. Before making subsequent requests to another server, the `/api/callbacks` endpoint is first requested. This endpoint returns the actual request that the client should make, potentially from another server. By default though, the same server is returned.  

## Data Server 

The [[DataServer]] is responsible for storing and retrieving JSON formatted data and metadata related to binary files. Specifically, it stores the following types of objects:
- [[MashObject]] 
- [[CastObject]]
- [[VideoDefinitionObject]]
- [[AudioDefinitionObject]]
- [[ImageDefinitionObject]]
- [[FontDefinitionObject]]
- [[VideoSequenceDefinitionObject]]

Its endpoints support typical _CRUD_ (create, retrieve, update, delete) operations:

<!-- MAGIC:START (API:include=data&exclude=stream) -->
{"include":"data","exclude":"stream"}
<!-- MAGIC:END -->

The client will typically request `/data/mash/default` or `/data/cast/default` in order to initially populate the [[Player]] and [[Timeline]] components. If the user has yet to create a [[Mash]] or [[Cast]] then an empty one is returned, otherwise the most recently created one is returned. A request is also made to `/data/mash/retrieve` or `/data/cast/retrieve` to populate the [[SelectEditedControl]] component.

The client will likely also start requesting `/data/definition/retrieve` in order to populate the [[Browser]] component. This accepts a `types` key in its argument to limit each request to a subset of [[DefinitionTypes]], as dictated by the currently selected [[BrowserPicker]] component.

The `/data/*/put` endpoints essentially act as _UPSERT_ (update or insert) mechanisms, depending on the optional `id` key provided in the object being saved. If it's undefined or prefixed by the `data.temporaryIdPrefix` value that was provided in the client configuration, then a new unique identifier is generated and the object is inserted into storage, otherwise an existing object is updated. 

## File Server
 The [[FileServer]] currently only supports a single endpoint that handles uploading of binary files: 

<!-- MAGIC:START (API:include=file) -->
{"include":"file"}
<!-- MAGIC:END -->

It is not typically called directly, but rather triggered as a callback from `/rendering/upload` (see below). 

## Rendering Server 

The [[RenderingServer]] produces media files, with the help of [Fluent FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg). The processing is asynchronous, so the API supports both starting a rendering job and retrieving its current status:  

<!-- MAGIC:START (API:include=rendering) -->
{"include":"rendering"}
<!-- MAGIC:END -->

The `/rendering/start` endpoint initiates a rendering process and returns a callback to `/rendering/status`. This endpoint keeps returning a callback to itself until the rendering process is complete. If a [[Mash]] was being rendering, a URL to the rendered file is returned in the final response. 

Users are able to import new media into the [[Browser]] without server interaction.  
The `/rendering/upload` endpoint is called for each new import as part of the saving process. 
This accepts metadata related to the file in its argument and returns two callbacks - one to `/file/store` to handle the file upload request itself, and another to `/rendering/start` that's executed afterwards. The later request may, depending on file type, specify several renderings producing multiple files. For instance, uploading a video file produces:

- an icon file for display in the [[Browser]] component
- an MP3 file containing the video's soundtrack
- a sequence of images representing the video's frames

The client uses these files exclusively, while the server will use the original upload whenever it subsequently renders or streams the video. Once all the files are generated for an upload the `/rendering/status` endpoint returns one final callback to `/data/definition/put` which saves and returns a [[DefinitionObject]] representing it. 

## Streaming Server 
The [[StreamingServer]] produces a video stream from a [[Cast]], potentially pushing it to another server. 

<!-- MAGIC:START (API:include=streaming&exclude=get,put,retrieve) -->
{"include":"streaming","exclude":"get,put,retrieve"}
<!-- MAGIC:END -->

| <svg width="1rem" height="1rem" viewBox="0 0 512 512" ><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" stroke="none" fill="currentColor" /></svg> | _Warning_ |
| -- | -- |
|  | This API is experimental and likely to change in subsequent versions, without being considered a 'breaking change' with regards to version number. |
