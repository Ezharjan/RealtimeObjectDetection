import Hls from "hls.js";
import _1 from "@tensorflow/tfjs-backend-cpu";
import _2 from "@tensorflow/tfjs-backend-webgl";
import * as CocoSsd from "@tensorflow-models/coco-ssd";

const pace = window.requestIdleCallback || window.requestAnimationFrame;

function getStreamUrl() {
  const default_stream = "https://ezharjan.github.io/M3U8Example/ene.m3u8";
  const params = new URLSearchParams(document.location.search.substring(1));
  return params.get("m3u8") || default_stream;
}

function getClasses() {
  const default_classes = "person";
  const params = new URLSearchParams(document.location.search.substring(1));
  return (params.get("classes") || default_classes).split(",");
}

function createVideoStream(video, url) {
  video.setAttribute("crossOrigin", "anonymous");
  video.volume = 0;
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => video.play());
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.setAttribute("src", url);
    video.addEventListener("canplay", () => video.play());
  }
  return new Promise((resolve) =>
    video.addEventListener("loadeddata", () => {
      video.setAttribute("hidden", "hidden");
      resolve(video);
    })
  );
}

async function startDetection(model, video) {
  let detectionCallback = null;
  const callback = async () => {
    let predictions = [];
    try {
      predictions = await model.detect(video);
    } catch (error) {
      pace(callback);
    }
    if (detectionCallback) {
      detectionCallback(predictions);
    }
    pace(callback);
  };
  return (onDetection) => {
    detectionCallback = onDetection;
    pace(callback);
  };
}

function drawPredictions(video, onDetection) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const isMouseOver = trackMousePosition(canvas);
  onDetection((predictions) => {
    const matchingPredictions = getMatchingPredictions(predictions);
    if (isMouseOver()) {
      showFullVideo(matchingPredictions, context, video);
    } else {
      showCutOff(matchingPredictions, context, video);
    }
  });
  return canvas;
}

function getMatchingPredictions(predictions) {
  const categories = getClasses();
  return predictions
    .filter(
      ({ class: category, score }) =>
        score > 0.5 && categories.includes(category)
    )
    .map(({ bbox }) => bbox);
}

function showFullVideo(matchingPredictions, context, video) {
  context.drawImage(video, 0, 0);
  matchingPredictions.forEach(([x, y, w, h]) => {
    context.beginPath();
    context.rect(x, y, w, h);
    context.stroke();
  });
}

function showCutOff(matchingPredictions, context, video) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  matchingPredictions.forEach(([x, y, w, h]) => {
    context.drawImage(video, x, y, w, h, x, y, w, h);
  });
}

function trackMousePosition(canvas) {
  let isMouseOver = false;
  canvas.addEventListener("mouseenter", () => (isMouseOver = true));
  canvas.addEventListener("mouseleave", () => (isMouseOver = false));
  return () => isMouseOver;
}

function setLoadingContent(loading, text) {
  loading.textContent = text;
}

async function init() {
  const loadingNode = document.getElementById("loading");
  const videoNode = document.getElementById("video");
  setLoadingContent(loadingNode, "Loading Model...");
  const model = await CocoSsd.load();
  setLoadingContent(loadingNode, "Creating Video Stream...");
  const video = await createVideoStream(videoNode, getStreamUrl());
  setLoadingContent(loadingNode, "Starting Detection...");
  const onDetection = await startDetection(model, video);
  loadingNode.classList.add("hidden");
  const canvas = drawPredictions(video, onDetection);
  videoNode.parentNode.appendChild(canvas);
}

init();
