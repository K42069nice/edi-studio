"use client";

import {
  createContext,
  useContext,
  useRef,
} from "react";

type ScrollFunction = (value: string) => void;

type EditorContextType = {
  scrollToValue: ScrollFunction;
  registerScrollFunction: (fn: ScrollFunction) => void;
};

const EditorContext = createContext<EditorContextType>({
  scrollToValue: () => {},
  registerScrollFunction: () => {},
});

export function EditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollFunction =
    useRef<ScrollFunction>(() => {});

  return (
    <EditorContext.Provider
      value={{
        scrollToValue: (value) => {
          scrollFunction.current(value);
        },

        registerScrollFunction: (fn) => {
          scrollFunction.current = fn;
        },
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}