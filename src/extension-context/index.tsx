import React, { useEffect, useState, useContext, ReactNode } from "react";
import { getSdk } from "./extension-sdk";
import { ContentFieldExtension } from 'dc-extensions-sdk';
import Params from "./params";
import { defaultMetadataMap } from "../model/conversion";

/**
 * Extension state.
 */
interface ExtensionContextData {
  params: Params,
  field?: any,
  sdk?: ContentFieldExtension,
  oldConfig?: any,
  setField?: () => void
}

/**
 * Default extension parameters. Overwritten by user instance/installation parameters.
 */
const defaultParams = {
  clientId: '',
  clientSecret: '',
  configPath: 'galleryConfig',
  galleryPath: 'photoGallery',
  metadataMap: defaultMetadataMap,
};

/**
 * Initial extension state.
 */
const defaultExtensionState = {
  params: {
    ...defaultParams,
  }
};

/**
 * Context for extension state.
 */
const ExtensionContext = React.createContext<ExtensionContextData>(defaultExtensionState);

/**
 * Provide a context for extensions state, allowing access to the field, params and extension SDK.
 * @param props React props
 * @returns React context
 */
export function ExtensionContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExtensionContextData>(defaultExtensionState);

  /**
   * UseEffect for managing extension state.
   */
  useEffect(() => {
    getSdk().then(async (sdk) => {
      sdk.frame.startAutoResizer();
      const field: any = await sdk.field.getValue();
      const params: Params = {
        ...defaultParams,
        ...sdk.params.installation,
        ...sdk.params.instance,
      };

      if (params.vse == null) {
        params.vse = sdk.visualisation;
      }

      const oldConfig = field[params.configPath];

      let state: ExtensionContextData = {
        ...defaultExtensionState,
        field,
        sdk,
        params,
        oldConfig: { ...oldConfig }
      };

      state.setField = () => {
        sdk.field.setValue(state.field);
      };

      setState({ ...state });
    });
  }, [setState]);

  return (
    <ExtensionContext.Provider value={state}>
      {children}
    </ExtensionContext.Provider>
  );
}

export function useExtension() {
  return useContext(ExtensionContext);
}
