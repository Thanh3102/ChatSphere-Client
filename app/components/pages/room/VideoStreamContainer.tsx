import { UserBasicInfo } from "@/app/shared/types/user";
import VideoStream from "./VideoStream";
import { number } from "zod";

interface Props {
  data: Record<string, { stream: MediaStream; user: UserBasicInfo }>;
}

export default function VideoStreamContainer({ data }: Props) {
  const calculateGridLayout = (
    numVideos: number,
    col: number,
    row: number,
    page: number,
    result: Array<{ row: number; col: number }>
  ) => {
    const maxRows = 6;
    const maxCols = 6;

    if (numVideos > maxRows * maxCols) {
      result.push({ row: maxRows, col: maxCols });
      return calculateGridLayout(
        numVideos - maxRows * maxCols,
        1,
        1,
        page + 1,
        result
      );
    }

    if (row * col >= numVideos) {
      result.push({ row: row, col: col });
      return result;
    }

    if (col > row)
      return calculateGridLayout(numVideos, col, row + 1, page, result);
    else return calculateGridLayout(numVideos, col + 1, row, page, result);
  };

  const result = calculateGridLayout(Object.keys(data).length, 1, 1, 1, []);


  return (
    <div
      className={`grid ${`grid-cols-${result[0].col}`} ${`grid-rows-${result[0].row}`} gap-4 p-4 h-full`}
      style={{
        gridTemplateColumns: `repeat(${result[0].col}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${result[0].row}, minmax(0, 1fr))`,
      }}
    >
      {Object.keys(data).map((key) => (
        <VideoStream
          stream={data[key].stream}
          user={data[key].user}
          key={key}
        />
      ))}
    </div>
  );
}
