// hooks/useErrandActions.jsx

import { useCallback, useRef } from "react";

export function useErrandActions({
  setErrands,
  possibleUndoCompleteErrand,
  possibleUndoDeleteErrand,
  setPossibleUndoCompleteErrand,
  setPossibleUndoDeleteErrand,
}) {
  const undoTimerRef = useRef(null);
  const previousUndoErrandRef = useRef(null);

  const onCompleteWithUndo = useCallback(
    (completedErrand) => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
        if (previousUndoErrandRef.current) {
          if (possibleUndoCompleteErrand) {
            // Complete errand backend
            // FIRESTORE UPDATE pending
            // await updateCompleteErrandInFirestore(previousUndoErrandRef.current);
          }
          if (possibleUndoDeleteErrand) {
            // Delete errand backend
            // FIRESTORE UPDATE pending
            // await updateDeleteErrandInFirestore(previousUndoErrandRef.current);
          }
        }
      }

      setPossibleUndoCompleteErrand(null);
      setPossibleUndoDeleteErrand(null);
      previousUndoErrandRef.current = completedErrand;

      setTimeout(() => {
        setPossibleUndoCompleteErrand(completedErrand);

        undoTimerRef.current = setTimeout(() => {
          setPossibleUndoCompleteErrand(null);
          undoTimerRef.current = null;
          // FIRESTORE UPDATE pending
          // await updateCompleteErrandInFirestore(completedErrand);
        }, 2000);
      }, 0);
    },
    [
      setPossibleUndoCompleteErrand,
      setPossibleUndoDeleteErrand,
      possibleUndoCompleteErrand,
      possibleUndoDeleteErrand,
      previousUndoErrandRef,
      undoTimerRef,
    ]
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
    setPossibleUndoCompleteErrand(null);
  }, [setErrands, setPossibleUndoCompleteErrand, previousUndoErrandRef]);

  const onDeleteWithUndo = useCallback(
    (deletedErrand) => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
        if (previousUndoErrandRef.current) {
          if (possibleUndoCompleteErrand) {
            // Complete errand backend
            // FIRESTORE UPDATE pending
            // await updateCompleteErrandInFirestore(previousUndoErrandRef.current);
          }
          if (possibleUndoDeleteErrand) {
            // Delete errand backend
            // FIRESTORE UPDATE pending
            // await updateDeleteErrandInFirestore(previousUndoErrandRef.current);
          }
          // FIRESTORE UPDATE pending
          // check if the undo is a completed or deleted errand
          // await updateErrandInFirestore(previousUndoErrandRef.current); if previous is completed then complete. if previous is deleted then delete
        }
      }

      setPossibleUndoCompleteErrand(null);
      setPossibleUndoDeleteErrand(null);
      previousUndoErrandRef.current = deletedErrand;

      setTimeout(() => {
        setPossibleUndoDeleteErrand(deletedErrand);

        undoTimerRef.current = setTimeout(() => {
          setPossibleUndoDeleteErrand(null);
          undoTimerRef.current = null;
          // FIRESTORE UPDATE pending
          // await updateErrandInFirestore(deletedErrand);
        }, 2000);
      }, 0);
    },
    [
      setPossibleUndoDeleteErrand,
      setPossibleUndoCompleteErrand,
      previousUndoErrandRef,
      undoTimerRef,
      possibleUndoCompleteErrand,
      possibleUndoDeleteErrand,
    ]
  );

  const undoDeleteErrand = useCallback(() => {
    setErrands((prev) =>
      prev.map((e) =>
        e.id === previousUndoErrandRef.current.id
          ? {
              ...e,
              deleted: false,
            }
          : e
      )
    );
    setPossibleUndoDeleteErrand(null);
  }, [setErrands, setPossibleUndoDeleteErrand]);

  return {
    onCompleteWithUndo,
    undoCompleteErrand,
    onDeleteWithUndo,
    undoDeleteErrand,
  };
}
