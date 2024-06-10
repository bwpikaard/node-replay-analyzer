import {readFile, writeFile} from "fs/promises";

import {parseReplay} from ".";

async function main(): Promise<void> {
    const fileBuff = await readFile("./replays/specjointeam_D2E1909049165B820FA29588660ECB92.replay");
    const replay = parseReplay(fileBuff);
    writeFile(`${__dirname}/replay.json`, JSON.stringify(replay, null, 4));
}

main();
