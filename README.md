# In Browser Real Time Object Detection From an HTTP Live Stream

This experiment combines [hsl.js](https://github.com/video-dev/hls.js/) and [tensorflow.js](https://www.tensorflow.org/js) to perform real time object detection from a browser. When the mouse hovers the canvas the entire stream is shown, with the detected object framed in a black box, otherwise only the parts of the stream corresponding to detected objects are displayed.

</div>

## Configuration

The experiment accepts two HTTP get params:

- `m3u8` a valid url poining to an HTTP Live Stream. default: https://test-streams.mux.dev/test_001/stream.m3u8.
- `classes` a comma separated list of objects we want the model to detect, valid values are [from this list](https://github.com/nightrome/cocostuff/blob/master/labels.txt). default: person.

ℹ️ <b>Note:</b> expect some loading time, since the model used by the experiment weights ~25Mb.

## Read the Code

All the code is in a single 128-lines file - [`js-src\index.js`](https://github.com/sandropaganotti/hls-coco/blob/master/js-src/index.js)

## Run Locally

- `docker-compose up --build` and then point a browser to `localhost:8080`
- run `docker-compose run node npm run dev` if you want your JS changes to be compiled.


## No Docker?

1. `npm run install`
2. `npm run build`
3. `npm run start`

<br>
<br>
<br>
<br>

Thanks!
