// import path from "path"
import fs from "fs"

const expectImageFile = async (filePath: string) => {
  // const fullPath = path.resolve(__dirname, '../../../', filePath)
  // console.log("fullPath", fullPath)
  const match = filePath.match(/%0[0-9]d/)
  if (match) {
    // get ffmpeg to make a hash of image sequence...
  } else {
    const buffer = await fs.promises.readFile(filePath)
    expect(buffer).toMatchImageSnapshot()
  }

}

export { expectImageFile }
