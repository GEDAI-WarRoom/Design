import { useSyncExternalStore } from "react";
import {
  assinarMockDatabase,
  obterRevisaoMockDatabase,
} from "./mockDatabase";

export function useMockDatabaseRevision() {
  return useSyncExternalStore(
    assinarMockDatabase,
    obterRevisaoMockDatabase,
    obterRevisaoMockDatabase,
  );
}
