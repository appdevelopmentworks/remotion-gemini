import type { FunctionComponent } from "react";
import { registerRoot } from "remotion";
import { RemotionRoot as PublicRemotionRoot } from "./Root";

type RootModule = {
  RemotionRoot?: FunctionComponent;
};

type RequireContext = {
  keys: () => string[];
  (id: string): RootModule;
};

declare const require: {
  context?: (
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp,
  ) => RequireContext;
};

const loadRoot = (): FunctionComponent => {
  const privateRootContext = require.context?.(
    "./private",
    false,
    /^\.\/Root\.tsx$/,
  );

  if (!privateRootContext) {
    return PublicRemotionRoot;
  }

  const [privateRootModulePath] = privateRootContext.keys();

  if (!privateRootModulePath) {
    return PublicRemotionRoot;
  }

  return (
    privateRootContext(privateRootModulePath).RemotionRoot ??
    PublicRemotionRoot
  );
};

registerRoot(loadRoot());
