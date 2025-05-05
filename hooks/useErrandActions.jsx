// hooks/useErrandActions.jsx

import { useCallback, useRef } from "react";

export function useErrandActions({ setErrands, setPossibleUndoErrand }) {
  const undoTimerRef = useRef(null);
  const previousUndoErrandRef = useRef(null);

  const onCompleteWithUndo = useCallback(
    (completedErrand) => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
        if (previousUndoErrandRef.current) {
          // FIRESTORE UPDATE pending
          // await updateErrandInFirestore(previousUndoErrandRef.current);
        }
      }

      setPossibleUndoErrand(null);
      previousUndoErrandRef.current = completedErrand;

      setTimeout(() => {
        setPossibleUndoErrand(completedErrand);

        undoTimerRef.current = setTimeout(() => {
          setPossibleUndoErrand(null);
          // FIRESTORE UPDATE pending
          // await updateErrandInFirestore(completedErrand);
        }, 2000);
      }, 0);
    },
    [setPossibleUndoErrand]
  );

  const undoCompleteErrand = useCallback(() => {
    setErrands((prev) =>
      prev.map((e) =>
        e.id === previousUndoErrandRef.current.id
          ? {
              ...e,
              completed: false,
              completedDateErrand: "",
              completedTimeErrand: "",
            }
          : e
      )
    );
    setPossibleUndoErrand(null);
  }, [setErrands, setPossibleUndoErrand]);

  return {
    onCompleteWithUndo,
    undoCompleteErrand,
  };
}
