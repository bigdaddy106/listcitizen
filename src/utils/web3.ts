import { readContract } from "wagmi/actions";
import {
  createPublicClient,
  http,
  parseAbiItem,
  decodeEventLog,
  Log,
} from "viem";
import { sepolia } from "viem/chains";
import _ from "lodash";
import { Citizen } from "../types/citizen";
import { address, eventInitFromBlocks } from "../constants/contract";
import FETestTaskABI from "../abis/FETestTask .json";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export async function fetchEventLogsFromInitFromBlocks() {
  const result = (await Promise.all(
    eventInitFromBlocks.map(async (eventInitFromBlock) => {
      const indLogs = await publicClient.getLogs({
        address,
        event: parseAbiItem(
          "event Citizen(uint indexed id, uint indexed age, string indexed city, string name)"
        ),
        fromBlock: eventInitFromBlock,
        toBlock: eventInitFromBlock + 10000n,
      });
      return indLogs;
    })
  )) as [][];
  const logs = [].concat(...result) as Log[];
  return logs;
}

export async function decodeLogsToCitizens(logs: Log[]) {
  const citizenData = logs.map((log) => {
    const data = decodeEventLog({
      abi: FETestTaskABI,
      data: log.data,
      topics: log.topics,
    }).args;

    return {
      id: Number(_.get(data, "id", 0) as number),
      age: Number(_.get(data, "age", 0) as number),
      city: _.get(data, "city", ""),
      name: _.get(data, "name", ""),
      someNote: "",
    } as Citizen;
  });
  return citizenData;
}

export async function getNoteByIdRange(from: number, range: number) {
  const result = [];
  try {
    for (let i = 0; i < range; i++) {
      const data = await readContract({
        address,
        abi: FETestTaskABI,
        functionName: "getNoteByCitizenId",
        args: [from + i],
      });
      result.push(data as string);
    }
  } catch (error) {
    console.log("Custom Not Found or OutOf ID");
  }

  return result;
}
