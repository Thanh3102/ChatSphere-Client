import { SelectContent } from "@/app/libs/redux/slices/AppSlice";
import ContentChat from "./ContentChat";

interface Props {
  selectContent: SelectContent;
}

export default function ContentDisplay({ selectContent }: Props) {
  switch (selectContent) {
    case SelectContent.CHAT:
      return <ContentChat />;
  }
}
