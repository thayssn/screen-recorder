const { desktopCapturer, ipcMain, Menu, dialog } = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const { writeFile, unlink } = require("fs");
const path = require("path");
const IPCEvents = require("./enums/events");

ipcMain.on(IPCEvents.REQUEST_SOURCES, async (event) => {
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
  });
  const defaultSource = sources[0];
  event.sender.send(IPCEvents.SOURCE_SELECTED, defaultSource);

  menuContext = Menu.buildFromTemplate(
    sources.map((source) => ({
      label: source.name,
      click: () => event.sender.send(IPCEvents.SOURCE_SELECTED, source),
    }))
  );

  menuContext.popup();
});

ipcMain.on(IPCEvents.SAVE_VIDEO, async (event, buffer) => {
  const { filePath, canceled } = await dialog.showSaveDialog({
    buttonLabel: "Save video",
    defaultPath: `vid-${Date.now()}.mp4`,
  });

  const fileName = filePath.split("/").pop();
  const tempPath = path.resolve("temp", fileName);

  if (canceled) {
    event.sender.send(IPCEvents.USER_CANCELLED);
    return;
  }

  try {
    await writeFile(tempPath, buffer, (err) => {
      if (err) {
        console.error(err);
        throw new Error("Não foi possível salvar o arquivo");
      }
    });

    ffmpeg(tempPath)
      .fps(30)
      .addOptions(["-y", "-crf 28"])
      .on("end", () => {
        handleCompressionEnd(tempPath, event);
      })
      .on("error", handleCompressionError)
      .save(filePath);
  } catch (err) {
    event.sender.send(IPCEvents.COMPRESSED_VIDEO, err);
  }
});

async function handleCompressionEnd(tempPath, event) {
  await unlink(tempPath, (err) => {
    if (!!err) {
      console.error(err);
      throw new Error(
        "Não foi possível excluir o arquivo temporário",
        tempPath
      );
    }

    event.sender.send(IPCEvents.COMPRESSED_VIDEO);
  });
}

function handleCompressionError(err) {
  console.error(err);
  throw new Error("Não foi possível comprimir o vídeo");
}

module.exports = {};
