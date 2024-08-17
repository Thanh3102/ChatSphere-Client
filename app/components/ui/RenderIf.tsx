import { ReactNode } from "react";

interface Props {
  condition: boolean | null | undefined;
  children?: ReactNode;
}

export default function RenderIf({ condition, children }: Props) {
  if (condition) {
    return children;
  }
  return null;
}
