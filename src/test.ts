import {readFile, writeFile} from "fs/promises";

import {parseReplay} from ".";

async function main(): Promise<void> {
    const fileBuff = await readFile("./replays/mle_5_276A5D184CAD11311EBA998E29DA01C5.replay");
    const replay = parseReplay(fileBuff);
    writeFile(`${__dirname}/replay.json`, JSON.stringify(replay, null, 4));
}

main();
