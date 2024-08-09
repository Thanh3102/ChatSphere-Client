"use client";

import { Button } from "@nextui-org/react";

export default function Error({ error, reset }: any) {
  return (
    <div>
      <span>Error: {error.message}</span>
      <Button color="primary" onClick={() => reset()}>Reload</Button>
    </div>
  );
}
