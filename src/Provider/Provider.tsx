import { PropsWithChildren } from "react";
import QueryClientProvider from "./QueryClientProvider";

const Provider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider>{children}</QueryClientProvider>;
};

export default Provider;
