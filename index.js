console.log("I am in indexJS");

// const canvas = new fabric.Canvas("canvas", {
//     width: 500,
//     height: 500,
// })

// canvas.requestRenderAll();

// fabric.Image.fromURL("https://i.imgur.com/s1gdxlH.jpg", (img) => {
//   canvas.backgroundImage = img;
// });

const initCanvas = (id) => {
  return new fabric.Canvas(id, {
    width: 500,
    height: 500,
    selection: false,
  });
};

const setBackground = (url, canvas) => {
  fabric.Image.fromURL(url, (img) => {
    canvas.backgroundImage = img;
    canvas.requestRenderAll();
  });
};

const toggleMode = (mode) => {
  if (mode === modes.pan) {
    if (currentMode === modes.pan) {
      currentMode = "";
    } else {
      currentMode = modes.pan;
      canvas.isDrawingMode = false;
      canvas.requestRenderAll();
    }
  } else if (mode === modes.drawing) {
    if (currentMode === modes.drawing) {
      currentMode = "";
      canvas.isDrawingMode = false;
      canvas.requestRenderAll();
    } else {
      currentMode = modes.drawing;
      canvas.freeDrawingBrush.color = color;
      canvas.isDrawingMode = true;
      canvas.requestRenderAll();
    }
  }
  // console.log(mode);
};

const setPanEvents = (canvas) => {
  canvas.on("mouse:move", (event) => {
    if (mousePressed && currentMode === modes.pan) {
      canvas.setCursor("grab");
      canvas.requestRenderAll();
      const mEvent = event.e;
      const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
      canvas.relativePan(delta);
    }
  });

  //keep track of mouse up & down

  canvas.on("mouse:down", (event) => {
    mousePressed = true;

    if (currentMode === modes.pan) {
      canvas.setCursor("grab");
      canvas.requestRenderAll();
    }
  });

  canvas.on("mouse:up", (event) => {
    mousePressed = false;
    canvas.setCursor("default");
    canvas.requestRenderAll();
  });
};

const setColorListener = () => {
  const picker = document.getElementById("colorPicker");
  picker.addEventListener("change", (event) => {
    console.log(event.target.value);
    color = event.target.value;
    canvas.freeDrawingBrush.color = color;
    canvas.requestRenderAll();
  });
};

const clearCanvas = (canvas, state) => {
  state.val = canvas.toSVG();
  canvas.getObjects().forEach((o) => {
    if (o !== canvas.backgroundImage) {
      canvas.remove(o);
    }
  });
};

const restoreCanvas = (canvas, state, bgUrl) => {
  if (state.val) {
    fabric.loadSVGFromString(state.val, (objects) => {
      objects = objects.filter((o) => o["xlink:href"] !== bgUrl);
      canvas.add(...objects);
      canvas.requestRenderAll;
    });
  }
};

const createRect = (canvas) => {
  const canvCenter = canvas.getCenter();
  const rect = new fabric.Rect({
    width: 100,
    height: 100,
    fill: "green",
    left: canvCenter.left,
    top: -50,
    originX: "center",
    originY: "center",
    cornerColor: "red",
    objectCaching: false,
  });
  canvas.add(rect);
  canvas.requestRenderAll();
  rect.animate("top", canvCenter.top, {
    onChange: canvas.renderAll.bind(canvas),
  });
  rect.on("selected", () => {
    rect.set("stroke", "white");
    canvas.requestRenderAll();
  });
  rect.on("deselected", () => {
    rect.set("stroke", "");

    canvas.renderAll();
  });
};

const createCirc = (canvas) => {
  const canvCenter = canvas.getCenter();
  const circle = new fabric.Circle({
    radius: 50,
    fill: "orange",
    left: canvCenter.left,
    top: -50,
    originX: "center",
    originY: "center",
    cornerColor: "red",
    objectCaching: false,
  });
  canvas.add(circle);
  canvas.requestRenderAll();
  circle.animate("top", canvas.height - 50, {
    onChange: canvas.renderAll.bind(canvas),
    onComplete: () => {
      circle.animate("top", canvCenter.top, {
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeOutBounce,
        duration: 500,
      });
    },
  });
  circle.on("selected", () => {
    circle.set("stroke", "white");
    canvas.requestRenderAll();
  });
  circle.on("deselected", () => {
    circle.set("stroke", "");
    canvas.renderAll();
  });
};

const groupObjects = (canvas, group, shouldGroup) => {
  if (shouldGroup) {
    const objects = canvas.getObjects();
    group.val = new fabric.Group(objects, {
      cornerColor: "white",
    });
    clearCanvas(canvas, svgState);
    canvas.add(group.val);
    canvas.requestRenderAll();
  } else {
    group.val.destroy();
    const oldGroup = group.val.getObjects();
    clearCanvas(canvas, svgState);
    // canvas.remove(group.val);
    canvas.add(...oldGroup);
    group.val = null;
    canvas.requestRenderAll();
  }
};

const imgAdded = (e) => {
  const inputElem = document.getElementById("myImg");
  const file = inputElem.files[0];

  reader.readAsDataURL(file);
};

const canvas = initCanvas("canvas");
const svgState = {};
let mousePressed = false;
let color = "#000000";
let group = {};
const bgUrl = "https://i.imgur.com/Ljke4K0.jpg";

let currentMode;
const modes = {
  pan: "pan",
  drawing: "drawing",
};

const reader = new FileReader();

setBackground(bgUrl, canvas);

setPanEvents(canvas);
setColorListener();

const inputFile = document.getElementById("myImg");
inputFile.addEventListener("change", imgAdded);

reader.addEventListener("load", () => {
  fabric.Image.fromURL(reader.result, (img) => {
    canvas.add(img);
    canvas.requestRenderAll;
  });
});
