import type { FunctionComponent } from "react";
import { registerRoot } from "remotion";
import { RemotionRoot as PublicRemotionRoot } from "./Root";

type RootModule = {
  RemotionRoot?: FunctionComponent;
};

declare const require: {
  (id: string): RootModule;
};

const loadRoot = (): FunctionComponent => {
  try {
    return require("./private/Root").RemotionRoot ?? PublicRemotionRoot;
  } catch {
    return PublicRemotionRoot;
  }
};

registerRoot(loadRoot());
