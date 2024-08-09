import { SelectContent } from "@/app/libs/redux/slices/AppSlice";
import ContentChat from "./ConversationBox/Contents/Chat/ContentChat";
import ContentPeople from "./ConversationBox/Contents/People/ContentPeople";
import ContentRequest from "./ConversationBox/Contents/Request/ContentRequest";
import ContentArchive from "./ConversationBox/Contents/Archive/ContentArchive";

interface Props {
  selectContent: SelectContent;
}

export default function ContentDisplay({ selectContent }: Props) {
  switch (selectContent) {
    case SelectContent.CHAT:
      return <ContentChat />;
    case SelectContent.PEOPLE:
      return <ContentPeople />;
    case SelectContent.REQUEST:
      return <ContentRequest />;
    case SelectContent.ARCHIVE:
      return <ContentArchive />;
  }
}
