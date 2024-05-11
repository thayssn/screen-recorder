const { app } = require("electron");
const config = require("./config");
const { desktopCapturer, ipcMain, Menu, dialog } = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const { writeFileSync, unlink, mkdirSync } = require("fs");
const path = require("path");
const IPCEvents = require("./enums/events");

ipcMain.on(IPCEvents.REQUEST_SOURCES, async (event) => {
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
  });
  const defaultSource = sources[0];
  event.sender.send(IPCEvents.SOURCE_SELECTED, defaultSource);

  const menuContext = Menu.buildFromTemplate(
    sources.map((source) => ({
      label: source.name,
      click: () => event.sender.send(IPCEvents.SOURCE_SELECTED, source),
    }))
  );

  menuContext.popup();
});

ipcMain.on(IPCEvents.CLOSE_APP, () => {
  app.quit();
});

ipcMain.on(IPCEvents.SAVE_VIDEO, async (event, buffer) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    buttonLabel: "Save recording",
    defaultPath: `screen-recorder-${Date.now()}.mp4`,
  });

  const fileName = filePath.split("/").pop();
  const folder = config.tempOutputFolder;
  const tempPath = path.resolve(folder, fileName);

  if (canceled) {
    event.sender.send(IPCEvents.USER_CANCELLED);
    return;
  }

  try {
    mkdirSync(folder, { recursive: true });
    writeFileSync(tempPath, buffer, (err) => {
      if (err) {
        console.error(err);
        event.sender.send(IPCEvents.SAVE_VIDEO, err);
      }
    });

    ffmpeg(tempPath)
      .fps(30)
      .addOptions(["-y", "-crf 28"])
      .on("end", () => {
        handleCompressionEnd(tempPath, event);
      })
      .on("error", (err) => {
        handleCompressionError(err, event);
      })
      .save(filePath);
  } catch (err) {
    handleCompressionError(err, event);
  }
});

async function handleCompressionEnd(tempPath, event) {
  unlink(tempPath, (err) => {
    if (err) {
      handleCompressionError(err, event);
    }

    event.sender.send(IPCEvents.COMPRESSED_VIDEO);
  });
}

function handleCompressionError(err, event) {
  console.error(err);
  event.sender.send(IPCEvents.COMPRESSED_VIDEO, err);
}

module.exports = {};
