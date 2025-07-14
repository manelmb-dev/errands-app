// Utils/SwipeableFullErrand.jsx
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import React from "react";

import RenderRightActionsErrand from "./RenderRightActionsErrand";
import FullErrand from "./fullErrand";

const SwipeableFullErrand = ({
  errand,
  setErrands,
  openSwipeableRef,
  swipeableRefs,
  onCompleteWithUndo,
  onDeleteWithUndo,
}) => {
  return (
    <Swipeable
      ref={(ref) => (swipeableRefs.current[errand.id] = ref)}
      renderRightActions={() => (
        <RenderRightActionsErrand
          errand={errand}
          setErrands={setErrands}
          onDeleteWithUndo={onDeleteWithUndo}
          openSwipeableRef={openSwipeableRef}
        />
      )}
      onSwipeableOpenStartDrag={() => {
        if (
          openSwipeableRef.current &&
          openSwipeableRef.current !== swipeableRefs.current[errand.id]
        ) {
          openSwipeableRef.current.close();
        }
        openSwipeableRef.current = swipeableRefs.current[errand.id];
      }}
    >
      <FullErrand
        errand={errand}
        openSwipeableRef={openSwipeableRef}
        swipeableRefs={swipeableRefs}
        onCompleteWithUndo={onCompleteWithUndo}
      />
    </Swipeable>
  );
};

export default SwipeableFullErrand;
